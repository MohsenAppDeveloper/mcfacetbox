import { NodeLocationType } from '@/types/tree'
import type { INodeChangePriority, ITree } from '@/types/tree'
import type { Rule } from '@/plugins/casl/ability'
import { useApi } from '@/composables/useApi'
import { createUrl } from '@/@core/composable/createUrl'
import { $api } from '@/utils/api'

// آداپتر سرویس درخت برای جداسازی وابستگی های شبکه از کامپوننت
export interface TreeServiceAdapter {
  fetchTree(treeId: number): Promise<ITree>
  updateTitle(nodeId: number, title: string): Promise<void>
  deleteNode(nodeId: number): Promise<void>
  addDescription(nodeId: number, description: string): Promise<void>
  moveNode(sourceId: number, destinationId: number, location: NodeLocationType): Promise<INodeChangePriority>
  getPermissions(treeId: number): Promise<Rule[]>
}

// پیاده سازی پیش فرض با استفاده از API داخلی موجود فعلی
export function createDefaultTreeServiceAdapter(): TreeServiceAdapter {
  return {
    async fetchTree(treeId: number) {
      const { data } = await useApi<ITree>(createUrl(`app/node/hierarchy/${treeId}`), { refetch: false })
      if (!data.value)
        throw new Error('Tree data not received')

      return data.value
    },
    async updateTitle(nodeId: number, title: string) {
      await $api(`app/node/${nodeId}/title`, {
        method: 'PUT',
        body: { title },
        ignoreResponseError: false,
      })
    },
    async deleteNode(nodeId: number) {
      await $api(`app/node/${nodeId}`, { method: 'DELETE' })
    },
    async addDescription(nodeId: number, description: string) {
      await $api(`app/node/${nodeId}/Description`, {
        method: 'PUT',
        body: { description },
        ignoreResponseError: false,
      })
    },
    async moveNode(sourceId: number, destinationId: number, location: NodeLocationType) {
      return await $api<INodeChangePriority>(`app/node/${sourceId}/move/${getNodeTypeNameSpace(location)}/${destinationId}`, {
        method: 'PUT',
        ignoreResponseError: false,
      })
    },
    async getPermissions(treeId: number) {
      return await $api<Rule[]>(`app/tree/${treeId}/user/permissions`)
    },
  }
}

// ابزار ساده برای تشخیص فضای نام نوع انتقال (قبلاً در کد اصلی استفاده می شد)
function getNodeTypeNameSpace(type: NodeLocationType): string {
  switch (type) {
    case NodeLocationType.Children: return 'Child'
    case NodeLocationType.SiblingBefore: return 'Before'
    case NodeLocationType.SiblingAfter: return 'After'
    default: return ''
  }
}
