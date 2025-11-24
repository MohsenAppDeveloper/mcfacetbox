import { computed, markRaw, reactive, shallowReactive } from 'vue'
import { defineStore } from 'pinia'
import { NodeLocationType, NodeRelationType } from '@/types/tree'
import type { INodeChangePriority, ISimpleFlatNodeActionable, ISimpleNestedNodeActionable, ITree } from '@/types/tree'
import { ExcerptSupervisionStat } from '@/types/dataShelf'

/**
 * این وضعیت برای تغییر شناسه نود در کامپوننت درخت از خارج از آن میباشد،
 */
export const useSelectTreeNode = createGlobalState(
  () => {
    const treeNodeIdMustBeSelect = ref<number>(0)

    return { treeNodeIdMustBeSelect }
  },
)

/**
 * Flat visible node for virtual scrolling
 * Extends flat node with depth and expansion info
 */
// export interface FlatVisibleNode extends ISimpleFlatNodeActionable {

// }

export const useTreeStoreV3 = defineStore('treeV3', () => {
  // ============================================
  // STATE: Single source of truth (Flat Store)
  // ============================================

  // Flat storage: Map for O(1) access
  const nodes = shallowReactive<Map<number, ISimpleFlatNodeActionable>>(new Map())

  // Children index for O(1) parent -> children id lookup
  // Keeps ordering by priority (descending) to avoid re-sorting loops
  const childrenByParent = shallowReactive<Map<number | null, number[]>>(new Map())

  // Track expanded nodes for lazy loading
  const expandedNodes = shallowReactive<Set<number>>(new Set())

  // Track which nodes have been loaded (for lazy loading)
  const loadedNodes = shallowReactive<Set<number>>(new Set())

  // Currently selected node
  const selectedNodeId = ref<number>(-1)

  const highlightedNodeId = ref<number>(-1)

  // Tree metadata
  const currentTreeId = ref<number>(0)
  const currentTreeTitle = ref<string>('')

  // ============================================
  // COMPUTED: Helper functions
  // ============================================

  /**
   * Get children of a specific parent node
   */
  const getChildrenIds = (parentId: number | null): number[] => {
    return childrenByParent.get(parentId) || []
  }

  const getChildren = (parentId: number | null): ISimpleFlatNodeActionable[] => {
    return getChildrenIds(parentId)
      .map(id => nodes.get(id))
      .filter((n): n is ISimpleFlatNodeActionable => !!n)
  }

  /**
   * Check if a node has children
   */
  const hasChildren = (nodeId: number): boolean => {
    const arr = childrenByParent.get(nodeId)

    return !!(arr && arr.length > 0)
  }

  /**
   * Get root nodes (nodes without parent)
   */
  const rootNodes = computed(() => getChildren(null))

  /**
   * Get a single node by ID
   */
  const getNode = (nodeId: number): ISimpleFlatNodeActionable | undefined => {
    return nodes.get(nodeId)
  }

  /**
   * Get node with its ancestors (for breadcrumb/path)
   */
  const getNodePath = (nodeId: number): string => {
    const path: string[] = []
    let currentNode = nodes.get(nodeId)

    while (currentNode) {
      path.unshift(currentNode.title)
      if (currentNode.parentId === null)
        break
      currentNode = nodes.get(currentNode.parentId)
    }

    return path.join(' \\ ')
  }

  const getParentNode = (nodeId: number): ISimpleFlatNodeActionable | undefined => {
    const currentNode = nodes.get(nodeId)
    if (currentNode && currentNode.parentId !== null)
      return nodes.get(currentNode.parentId)

    else
      return undefined
  }

  /**
   * Get all ancestor IDs of a node
   */
  const getAncestorIds = (nodeId: number): number[] => {
    const ancestors: number[] = []
    let currentNode = nodes.get(nodeId)

    while (currentNode && currentNode.parentId !== null) {
      ancestors.unshift(currentNode.parentId)
      currentNode = nodes.get(currentNode.parentId)
    }

    return ancestors
  }

  /**
   * Check if node is last sibling
   */
  const isLastSibling = (nodeId: number): boolean => {
    const node = nodes.get(nodeId)
    if (!node)
      return false

    const siblings = getChildren(node.parentId)

    return siblings[siblings.length - 1]?.id === nodeId
  }

  /**
   * Get currently selected node
   */
  const selectedNode = computed<ISimpleFlatNodeActionable | null>(() => {
    if (selectedNodeId.value <= 0)
      return null

    return nodes.get(selectedNodeId.value) || null
  })

  /**
   * Flatten tree to only visible nodes for virtual scrolling
   * Returns a flat array with depth information for indentation
   */
  const flatVisibleNodes = computed<ISimpleFlatNodeActionable[]>(() => {
    const result: ISimpleFlatNodeActionable[] = []

    const traverse = (nodeId: number, depth: number = 0) => {
      const node = nodes.get(nodeId)
      if (!node)
        return

      const isExpanded = expandedNodes.has(nodeId)
      const isLoaded = loadedNodes.has(nodeId)

      node.depth = depth + 1
      node.isExpanded = isExpanded
      node.isLoaded = isLoaded
      result.push({
        ...node,
      })

      //   console.log('addchildren', node, depth)

      // Only add children if node is expanded
      if (isExpanded) {
        const children = getChildren(nodeId)

        children.forEach(child => traverse(child.id, node.depth))
      }
    }

    // Start with root nodes
    rootNodes.value.forEach(node => traverse(node.id, 0))

    return result
  })

  // ============================================
  // ACTIONS: Data Loading
  // ============================================

  /**
   * Load tree hierarchy from server
   */
  const loadTree = async (data: ITree) => {
    // Clear existing state
    nodes.clear()
    expandedNodes.clear()
    childrenByParent.clear()
    selectedNodeId.value = -1

    // Set tree metadata
    currentTreeId.value = data.id
    currentTreeTitle.value = data.title

    // Flatten the nested tree structure
    const flattenTree = (
      nodeArray: ISimpleNestedNodeActionable[],
      parentId: number | null = null,
    ) => {
      if (!childrenByParent.has(parentId))
        childrenByParent.set(parentId, [])
      nodeArray.forEach(node => {
        const flatNode: ISimpleFlatNodeActionable = markRaw({
          id: node.id,
          parentId,
          title: node.title,
          priority: node.priority || 0,
          hasDescription: node.hasDescription || false,
          relationCount: node.relationCount || 0,
          referenceCount: node.referenceCount || 0,
          hasChildren: (node.children?.length ?? 0) > 0,
          depth: 0,
          isExpanded: false,
          isLoaded: false,
          excerptCount: node.excerptCount,
          highlighted: false,
        })

        nodes.set(node.id, flatNode)
        childrenByParent.get(parentId)!.push(node.id)

        // Maintain ordering right away (priority descending)
        childrenByParent.get(parentId)!.sort((a, b) => {
          const na = nodes.get(a)!
          const nb = nodes.get(b)!

          return nb.priority - na.priority
        })
        if (node.children && node.children.length > 0)
          flattenTree(node.children, node.id)
      })
    }

    if (data.nodes && data.nodes.length > 0)
      flattenTree(data.nodes)
  }

  /**
   * Toggle node expansion state (for virtual scroll tree)
   */
  const toggleNodeExpansion = (nodeId: number) => {
    if (expandedNodes.has(nodeId)) {
      expandedNodes.delete(nodeId)
    }
    else {
      expandedNodes.add(nodeId)

      // Mark as loaded if it has children
      if (hasChildren(nodeId))
        loadedNodes.add(nodeId)
    }
  }

  /**
   * Expand a node
   */
  const expandNode = (nodeId: number) => {
    if (!expandedNodes.has(nodeId)) {
      expandedNodes.add(nodeId)
      if (hasChildren(nodeId))
        loadedNodes.add(nodeId)
    }
  }

  /**
   * Collapse a node
   */
  const collapseNode = (nodeId: number) => {
    expandedNodes.delete(nodeId)
  }

  /**
   * Clear all tree data
   */
  const clearTree = () => {
    nodes.clear()
    expandedNodes.clear()
    childrenByParent.clear()
    selectedNodeId.value = -1
    currentTreeId.value = 0
    currentTreeTitle.value = ''
  }

  // ============================================
  // ACTIONS: Node CRUD Operations
  // ============================================

  /**
   * Create a new node
   */
  const createNode = (nodeData: Partial<ISimpleFlatNodeActionable> & { id: number; parentId: number | null; title: string }, targetNodeId: number, nodelocationType: NodeLocationType) => {
    const targetNode = nodes.get(targetNodeId)
    let parentId: number | null

    // let priority: number
    switch (nodelocationType) {
    case NodeLocationType.Children:
        parentId = nodeData.parentId
        setNodeChildrenState(parentId, true)
      break
    case NodeLocationType.SiblingBefore:
    case NodeLocationType.SiblingAfter:
        parentId = targetNode?.parentId || null
      break

    default:
      return null
    }

    const newNode: ISimpleFlatNodeActionable = markRaw({
      id: nodeData.id,
      parentId,
      title: nodeData.title,
      priority: nodeData.priority || 0,
      hasDescription: nodeData.hasDescription || false,
      relationCount: nodeData.relationCount || 0,
      referenceCount: nodeData.referenceCount || 0,
      hasChildren: false,
      depth: 0,
      isExpanded: false,
      isLoaded: false,
      excerptCount: new ExcerptSupervisionStat(0),
      highlighted: false,
    })

    nodes.set(newNode.id, newNode)
    if (!childrenByParent.has(parentId))
      childrenByParent.set(parentId, [])
    childrenByParent.get(parentId)!.push(newNode.id)

    // Reorder children by priority
    childrenByParent.get(parentId)!.sort((a, b) => (nodes.get(b)!.priority - nodes.get(a)!.priority))

    return newNode
  }

  /**
   * Update node properties (immutable pattern for reactivity)
   */
  const updateNode = (nodeId: number, updates: Partial<ISimpleFlatNodeActionable>) => {
    const existingNode = nodes.get(nodeId)
    if (!existingNode)
      return false

    // Create new object (immutable update)
    const updatedNode = markRaw({
      ...existingNode,
      ...updates,
    })

    // Replace node triggers shallow reactivity
    nodes.set(nodeId, updatedNode)

    return true
  }

  /**
   * Delete node and all its descendants
   */
  const deleteNode = (nodeId: number) => {
    // Find all descendants recursively
    const nodesToDelete: number[] = [nodeId]
    const parentNode = getParentNode(nodeId)

    const findDescendants = (parentId: number) => {
      const childIds = childrenByParent.get(parentId) || []

      childIds.forEach(id => {
        nodesToDelete.push(id)
        findDescendants(id)
      })
    }

    findDescendants(nodeId)

    // Delete all nodes
    nodesToDelete.forEach(id => {
      nodes.delete(id)
      expandedNodes.delete(id)

      const arr = childrenByParent.get(id)
      if (arr)
        childrenByParent.delete(id)
    })

    // Remove from parent's children array
    if (parentNode) {
      const siblings = childrenByParent.get(parentNode.id)
      if (siblings) {
        const idx = siblings.indexOf(nodeId)
        if (idx >= 0)
          siblings.splice(idx, 1)
      }
    }

    // Clear selection if deleted
    if (nodesToDelete.includes(selectedNodeId.value))
      selectedNodeId.value = -1

    if (parentNode)
      updateNode(parentNode.id, { hasChildren: hasChildren(parentNode.id) })

    return nodesToDelete
  }

  const increaseRelatedNodeCount = (nodeid: number, relationtype: NodeRelationType) => {
    const targetNode = nodes.get(nodeid)
    if (!targetNode)
      return
    if (relationtype === NodeRelationType.relation)
      updateNode(nodeid, { relationCount: (targetNode.relationCount ?? 0) + 1 })
    else
      updateNode(nodeid, { referenceCount: (targetNode.referenceCount ?? 0) + 1 })
  }

  const decreaseRelatedNodeCount = (nodeid: number, relationtype: NodeRelationType) => {
    const targetNode = nodes.get(nodeid)
    if (!targetNode)
      return
    if (relationtype === NodeRelationType.relation)
      updateNode(nodeid, { relationCount: (targetNode.relationCount ?? 0) === 0 ? targetNode.relationCount : targetNode.relationCount - 1 })

    //   targetNode.relationCount = (targetNode.relationCount ?? 0) === 0 ? targetNode.relationCount : targetNode.relationCount - 1

    else
      updateNode(nodeid, { referenceCount: (targetNode.referenceCount ?? 0) === 0 ? targetNode.referenceCount : targetNode.referenceCount - 1 })

    //   targetNode.referenceCount = (targetNode.referenceCount ?? 0) === 0 ? targetNode.referenceCount : targetNode.referenceCount - 1
  }

  /**
   * Move node to new parent with new position
   */
  const moveNode = (
    nodeId: number,
    destinationId: number,
    destinationPriority: number,
    moveType: NodeLocationType,
  ): boolean => {
    const sourceNode = nodes.get(nodeId)
    const destNode = nodes.get(destinationId)

    if (!sourceNode || !destNode)
      return false

    // Prevent moving to own descendant
    if (isDescendant(destinationId, nodeId))
      return false

    let newParentId: number | null

    // let newPriority: number

    switch (moveType) {
      case NodeLocationType.Children:
        newParentId = destinationId

        // Move as child of destination
      break

      case NodeLocationType.SiblingBefore:
      case NodeLocationType.SiblingAfter:
        newParentId = destNode.parentId
        break

      default:
        return false
    }
    updateNode(nodeId, {
      parentId: newParentId,
      priority: destinationPriority,
    })

    // Update children index: remove from old parent list
    const oldParentId = sourceNode.parentId
    if (oldParentId !== newParentId) {
      const oldArr = childrenByParent.get(oldParentId)
      if (oldArr) {
        const idx = oldArr.indexOf(nodeId)
        if (idx >= 0)
          oldArr.splice(idx, 1)
      }
      if (!childrenByParent.has(newParentId))
        childrenByParent.set(newParentId, [])
      childrenByParent.get(newParentId)!.push(nodeId)
    }

    // Reorder destination siblings by priority
    if (childrenByParent.get(newParentId))
      childrenByParent.get(newParentId)!.sort((a, b) => (nodes.get(b)!.priority - nodes.get(a)!.priority))

    if (sourceNode.parentId)
      updateNode(sourceNode.parentId, { hasChildren: hasChildren(sourceNode.parentId) })

    if (newParentId) {
      updateNode(newParentId, {
        hasChildren: true,
      })
    }

    return true
  }

  /**
   * Merge source node into destination (move all children)
   */
  const mergeNode = (sourceId: number, destinationId: number, newNodePriority: INodeChangePriority[]): boolean => {
    const sourceNode = nodes.get(sourceId)
    const destNode = nodes.get(destinationId)
    if (!sourceNode || !destNode)
      return false
    if (sourceId === destinationId)
      return false

    // Move all children of source to destination
    const children = getChildren(sourceId)

    children.forEach(child => {
      const updatedPriority = newNodePriority.find(a => a.id === child.id)?.priority ?? child.priority

      updateNode(child.id, {
        parentId: destinationId,
        priority: updatedPriority,
      })

      // Remove child from old parent index list
      const oldArr = childrenByParent.get(sourceId)
      if (oldArr) {
        const idx = oldArr.indexOf(child.id)
        if (idx >= 0)
          oldArr.splice(idx, 1)
      }
      if (!childrenByParent.has(destinationId))
        childrenByParent.set(destinationId, [])
      childrenByParent.get(destinationId)!.push(child.id)
    })

    // Reorder destination children
    const destArr = childrenByParent.get(destinationId)
    if (destArr)
      destArr.sort((a, b) => (nodes.get(b)!.priority - nodes.get(a)!.priority))

    // Delete source node
    deleteNode(sourceId)

    if (sourceNode.parentId)
      updateNode(sourceNode.parentId, { hasChildren: hasChildren(sourceNode.parentId) })
    if (destNode) {
      updateNode(destinationId, {
        hasChildren: children.length > 0,
      })
    }

    return true
  }

  /**
   * Check if targetId is a descendant of nodeId
   */
  const isDescendant = (targetId: number, nodeId: number): boolean => {
    let current = nodes.get(targetId)

    while (current) {
      if (current.parentId === nodeId)
        return true
      if (current.parentId === null)
        return false
      current = nodes.get(current.parentId)
    }

    return false
  }

  /**
   * Increment priority of siblings at or after a given priority
   */
  const incrementSiblingPriorities = (parentId: number | null, fromPriority: number) => {
    const siblings = getChildren(parentId)

    siblings.forEach(sibling => {
      if (sibling.priority >= fromPriority) {
        updateNode(sibling.id, {
          priority: sibling.priority + 1,
        })
      }
    })
  }

  // ============================================
  // ACTIONS: Selection & UI State
  // ============================================

  /**
   * Highlight a node
   */
  const highlightNode = (nodeId: number) => {
    // Deselect previous
    if (highlightedNodeId.value > 0 || highlightedNodeId.value === -currentTreeId.value)
      updateNode(highlightedNodeId.value, { highlighted: false })

    // Select new
    if (nodes.has(nodeId)) {
      updateNode(nodeId, { highlighted: true })
      highlightedNodeId.value = nodeId
    }
    else {
      highlightedNodeId.value = -1
    }
  }

  /**
   * Select a node
   */
  const selectNode = (nodeId: number) => {
    // Deselect previous
    if (selectedNodeId.value > 0 || selectedNodeId.value === -currentTreeId.value)
      updateNode(selectedNodeId.value, { selected: false })

    // Select new
    if (nodes.has(nodeId)) {
      updateNode(nodeId, { selected: true })
      selectedNodeId.value = nodeId
    }
    else {
      selectedNodeId.value = -1
    }
  }

  /**
   * Deselect all nodes
   */
  const deselectAll = () => {
    if (selectedNodeId.value > 0 || selectedNodeId.value === -currentTreeId.value)
      updateNode(selectedNodeId.value, { selected: false })

    selectedNodeId.value = -1
  }

  /**
   * Start editing a node
   */
  const startEditing = (nodeId: number) => {
    const node = nodes.get(nodeId)
    if (!node)
      return false

    updateNode(nodeId, {
      editing: true,
      tempData: node.title,
    })

    return true
  }

  /**
   * Cancel editing
   */
  const cancelEditing = (nodeId: number) => {
    updateNode(nodeId, {
      editing: false,
      failed: false,
      loading: false,
    })
  }

  /**
   * Complete editing with new title
   */
  const completeEditing = (nodeId: number, newTitle: string) => {
    updateNode(nodeId, {
      title: newTitle,
      editing: false,
      loading: false,
      failed: false,
    })
  }

  const setNodeChildrenState = (nodeId: number, haschildren: boolean) => {
    updateNode(nodeId, { hasChildren: haschildren })
  }

  /**
   * Set node loading state
   */
  const setNodeLoading = (nodeId: number, loading: boolean) => {
    updateNode(nodeId, { loading })
  }

  /**
   * Set node failed state
   */
  const setNodeFailed = (nodeId: number, failed: boolean) => {
    updateNode(nodeId, { failed })
  }

  // ============================================
  // RETURN: Public API
  // ============================================

  return {
    // State
    nodes,
    childrenByParent,
    expandedNodes,
    loadedNodes,
    selectedNodeId,
    currentTreeId,
    highlightedNodeId,
    currentTreeTitle,

    // Computed
    rootNodes,
    selectedNode,
    flatVisibleNodes, // For virtual scrolling

    // Getters
    getNode,
    getChildren,
    getChildrenIds,
    hasChildren,
    getNodePath,
    getAncestorIds,
    isLastSibling,
    getParentNode,
    isDescendant,

    // Actions: Data
    loadTree,
    clearTree,

    // Actions: Node Expansion (for virtual scroll)
    toggleNodeExpansion,
    expandNode,
    collapseNode,

    // Actions: CRUD
    createNode,
    updateNode,
    deleteNode,
    moveNode,
    mergeNode,
    increaseRelatedNodeCount,
    decreaseRelatedNodeCount,

    // Actions: UI State
    highlightNode,
    selectNode,
    deselectAll,
    startEditing,
    cancelEditing,
    completeEditing,
    setNodeLoading,
    setNodeFailed,
  }
})
