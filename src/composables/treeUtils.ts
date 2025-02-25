import type { ISimpleTree } from '@/types/baseModels'

export function treeNodeDeselectAll(tree: ISimpleTree[]): void {
  tree.forEach(treenode => {
    treenode.selected = false
    if (treenode.children)
      treeNodeDeselectAll(treenode.children)
  })
}
