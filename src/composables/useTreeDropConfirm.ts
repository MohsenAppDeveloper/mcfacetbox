import { getCurrentInstance } from 'vue'
import type { ISimpleFlatNodeActionable } from '@/types/tree'
import { NodeLocationType } from '@/types/tree'

export interface DropIntentPayload {
  sourceNode: ISimpleFlatNodeActionable
  destinationNode: ISimpleFlatNodeActionable
  location: NodeLocationType
  preventDefault: () => void
  proceed: () => void
  cancel: () => void
}

/**
 * Provides a ready-to-use handler for MCTreeView `nodedrop` event.
 * - Calls `preventDefault()` to stop auto-drop
 * - Shows SweetAlert2 confirmation (if plugin is installed)
 * - Calls `proceed()` or `cancel()` based on user choice
 */
export function useTreeDropConfirm() {
  const { proxy } = getCurrentInstance() || {}

  function onPreDrop(p: DropIntentPayload) {
    // Stop default drop so we can confirm first
    p.preventDefault()

    const title = `آیا از انتقال «${p.sourceNode.title}» به «${p.destinationNode.title}» مطمئن هستید؟`

    // Prefer SweetAlert2 if available, else use window.confirm
    const swal = (proxy as any)?.$swal
    if (swal && typeof swal.fire === 'function') {
      swal.fire({
        title,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'بله، انجام بده',
        cancelButtonText: 'خیر',
      })
        .then((res: any) => { res?.isConfirmed ? p.proceed() : p.cancel() })
        .catch(() => p.cancel())
    }
    else {
      const ok = window.confirm(title)
      if (ok) p.proceed()
      else p.cancel()
    }
  }

  return { onPreDrop }
}
