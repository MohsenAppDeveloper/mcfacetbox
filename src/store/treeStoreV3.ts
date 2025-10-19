import { computed, markRaw, reactive, shallowReactive } from 'vue'
import { defineStore } from 'pinia'
import type { ISimpleFlatNodeActionable, ISimpleNestedNodeActionable, ITree } from '@/types/tree'
import { NodeType } from '@/types/tree'

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

  // Track expanded nodes for lazy loading
  const expandedNodes = shallowReactive<Set<number>>(new Set())

  // Track which nodes have been loaded (for lazy loading)
  const loadedNodes = shallowReactive<Set<number>>(new Set())

  // Currently selected node
  const selectedNodeId = ref<number>(-1)

  const selecteNodeScrollPosition = ref<number>(0)

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
  const getChildren = (parentId: number | null): ISimpleFlatNodeActionable[] => {
    const children: ISimpleFlatNodeActionable[] = []

    nodes.forEach(node => {
      if (node.parentId === parentId)
        children.push(node)
    })

    // Sort by priority
    return children.sort((a, b) => a.priority - b.priority)
  }

  /**
   * Check if a node has children
   */
  const hasChildren = (nodeId: number): boolean => {
    for (const node of nodes.values()) {
      if (node.parentId === nodeId)
        return true
    }

    return false
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
   * Build display tree for VTreeview (with lazy loading support)
   * Note: Do NOT use markRaw here - we need reactivity for VTreeview
   */
  const buildDisplayNode = (nodeId: number): ISimpleNestedNodeActionable | null => {
    const node = nodes.get(nodeId)
    if (!node)
      return null

    // Create reactive object for display (not marked as raw)
    return reactive({
      id: node.id,
      parentId: node.parentId,
      title: node.title,
      priority: node.priority,
      hasDescription: node.hasDescription,
      relationCount: node.relationCount,
      referenceCount: node.referenceCount,
      selected: node.selected,
      editing: node.editing,
      loading: node.loading,
      failed: node.failed,
      tempData: node.tempData,

      // For lazy loading: empty array if has children, undefined otherwise
      children: hasChildren(node.id) ? [] : undefined,
    }) as ISimpleNestedNodeActionable
  }

  /**
   * Build tree structure for display (only root level initially)
   */
  const treeData = computed<ISimpleNestedNodeActionable[]>(() => {
    return rootNodes.value
      .map(node => buildDisplayNode(node.id))
      .filter((node): node is ISimpleNestedNodeActionable => node !== null)
  })

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
    selectedNodeId.value = -1

    // Set tree metadata
    currentTreeId.value = data.id
    currentTreeTitle.value = data.title

    // Flatten the nested tree structure
    const flattenTree = (
      nodeArray: ISimpleNestedNodeActionable[],
      parentId: number | null = null,
    ) => {
      nodeArray.forEach(node => {
        // Create flat node (immutable)
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
        })

        nodes.set(node.id, flatNode)

        // Recursively flatten children
        if (node.children && node.children.length > 0)
          flattenTree(node.children, node.id)
      })
    }

    if (data.nodes && data.nodes.length > 0)
      flattenTree(data.nodes)

    console.log('Loaded tree with', nodes.size, 'nodes')
    console.log('nodes', nodes)
  }

  /**
   * Load children for lazy loading
   *
   * Since we used expandedNodes to determine which nodes must be shown, we don't need to use this function for now.
   */
  const loadChildrenForDisplay = (nodeId: number): ISimpleNestedNodeActionable[] => {
    const children = getChildren(nodeId)

    expandedNodes.add(nodeId)
    loadedNodes.add(nodeId)

    return children
      .map(node => buildDisplayNode(node.id))
      .filter((node): node is ISimpleNestedNodeActionable => node !== null)
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
  const createNode = (nodeData: Partial<ISimpleFlatNodeActionable> & { id: number; parentId: number | null; title: string }) => {
    const newNode: ISimpleFlatNodeActionable = markRaw({
      id: nodeData.id,
      parentId: nodeData.parentId,
      title: nodeData.title,
      priority: nodeData.priority || 0,
      hasDescription: nodeData.hasDescription || false,
      relationCount: nodeData.relationCount || 0,
      referenceCount: nodeData.referenceCount || 0,
      hasChildren: false,
      depth: 0,
      isExpanded: false,
      isLoaded: false,
    })

    nodes.set(newNode.id, newNode)

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

    const findDescendants = (parentId: number) => {
      nodes.forEach(node => {
        if (node.parentId === parentId) {
          nodesToDelete.push(node.id)
          findDescendants(node.id)
        }
      })
    }

    findDescendants(nodeId)

    // Delete all nodes
    nodesToDelete.forEach(id => {
      nodes.delete(id)
      expandedNodes.delete(id)
    })

    // Clear selection if deleted
    if (nodesToDelete.includes(selectedNodeId.value))
      selectedNodeId.value = -1

    return nodesToDelete
  }

  /**
   * Move node to new parent with new position
   */
  const moveNode = (
    nodeId: number,
    destinationId: number,
    moveType: NodeType,
  ): boolean => {
    const sourceNode = nodes.get(nodeId)
    const destNode = nodes.get(destinationId)

    if (!sourceNode || !destNode)
      return false

    // Prevent moving to own descendant
    if (isDescendant(destinationId, nodeId))
      return false

    let newParentId: number | null
    let newPriority: number

    switch (moveType) {
      case NodeType.Children:
      // Move as child of destination
        newParentId = destinationId
        newPriority = getChildren(destinationId).length
        break

      case NodeType.SiblingBefore:
      // Move as sibling before destination
        newParentId = destNode.parentId
        newPriority = destNode.priority

      // Increment priority of siblings after
        incrementSiblingPriorities(newParentId, destNode.priority)
        break

      case NodeType.SiblingAfter:
      // Move as sibling after destination
        newParentId = destNode.parentId
        newPriority = destNode.priority + 1

      // Increment priority of siblings after
        incrementSiblingPriorities(newParentId, destNode.priority + 1)
        break

      default:
        return false
    }

    updateNode(nodeId, {
      parentId: newParentId,
      priority: newPriority,
    })

    return true
  }

  /**
   * Merge source node into destination (move all children)
   */
  const mergeNode = (sourceId: number, destinationId: number): boolean => {
    const sourceNode = nodes.get(sourceId)
    const destNode = nodes.get(destinationId)

    if (!sourceNode || !destNode)
      return false
    if (sourceId === destinationId)
      return false

    // Move all children of source to destination
    const children = getChildren(sourceId)

    children.forEach(child => {
      updateNode(child.id, {
        parentId: destinationId,
      })
    })

    // Delete source node
    deleteNode(sourceId)

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
    if (highlightedNodeId.value > 0)
      updateNode(highlightedNodeId.value, { highlighted: false })

    // Select new
    if (nodeId > 0 && nodes.has(nodeId)) {
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
  const selectNode = (nodeId: number, scrollPosition: number = 0) => {
    // Deselect previous
    if (selectedNodeId.value > 0)
      updateNode(selectedNodeId.value, { selected: false })

    // Select new
    if (nodeId > 0 && nodes.has(nodeId)) {
      updateNode(nodeId, { selected: true })
      selectedNodeId.value = nodeId
      selecteNodeScrollPosition.value = scrollPosition
    }
    else {
      selectedNodeId.value = -1
      selecteNodeScrollPosition.value = 0
    }
  }

  /**
   * Deselect all nodes
   */
  const deselectAll = () => {
    if (selectedNodeId.value > 0)
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
    expandedNodes,
    loadedNodes,
    selectedNodeId,
    currentTreeId,
    highlightedNodeId,
    currentTreeTitle,
    selecteNodeScrollPosition,

    // Computed
    treeData,
    rootNodes,
    selectedNode,
    flatVisibleNodes, // For virtual scrolling

    // Getters
    getNode,
    getChildren,
    hasChildren,
    getNodePath,
    getAncestorIds,
    isLastSibling,
    buildDisplayNode,

    // Actions: Data
    loadTree,
    loadChildrenForDisplay,
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
