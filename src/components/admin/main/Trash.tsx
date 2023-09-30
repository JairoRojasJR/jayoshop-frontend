import { Modaldiv, openModal, closeModal } from '@/components/global/Modal'
import WarnDelete from '@/components/admin/utils/WarnDelete'
import { jtoast } from '@/packages/jtoast/Jtoast'
import type {
  OnSuccesServer,
  Product,
  Section,
  SendId,
  SendMultiTrashServer,
  TargetServer
} from '@/types'
import { handleRes } from '@/services/admin/inventory'
import { nanoid } from 'nanoid'

type Props = {
  Card: React.ElementType
  data: Product | Section
  wish: string
  send: SendId
  onSuccess: OnSuccesServer
}

export default function Trash({
  Card,
  data,
  wish,
  send,
  onSuccess
}: Props): JSX.Element {
  const sendToDelete = async (): Promise<void> => {
    const res = await send({ _id: data._id })
    handleRes(res, onSuccess)
  }

  return (
    <Modaldiv>
      <main
        className='df fdc'
        onClick={e => {
          e.stopPropagation()
        }}
      >
        <Card data={data} />
        <WarnDelete wish={wish} runDelete={sendToDelete} />
      </main>
    </Modaldiv>
  )
}

export const runMultiTrash = (
  isMultipleTrashReady: boolean,
  Component: JSX.Element
): void => {
  if (!isMultipleTrashReady) {
    jtoast('👇 Seleccione al menos dos items')
    return
  }
  openModal({ Component })
}

type MultiTrashProps = {
  Card: React.ElementType
  items: Product[] | Section[]
  target: TargetServer
  wish: string
  send: SendMultiTrashServer
  onSuccess: OnSuccesServer
}

export function MultiTrash({
  Card,
  items,
  target,
  wish,
  send,
  onSuccess
}: MultiTrashProps): JSX.Element {
  const sendToDelete = async (): Promise<void> => {
    const cleanItems = items.map(item => ({ _id: item._id }))
    const res = await send(cleanItems)

    if (res.error !== undefined) {
      const notifications = [
        `${res.deleting.count} eliminados`,
        `Surgió un error al eliminar (${res.deleting[target].name})`,
        `Error: ${res.error}`
      ]

      notifications.forEach(notification => {
        jtoast(notification, { duration: 5000 })
      })

      if (res.deleting.count > 0) onSuccess()
      closeModal()
    } else if (res.message !== undefined) {
      jtoast(res.message)
      onSuccess()
      closeModal()
    }
  }

  return (
    <Modaldiv>
      <div className='df fdc' style={{ maxHeight: '100%' }}>
        <section
          className='df fdc bcS pgS gpM'
          style={{
            borderTopLeftRadius: '0.3rem',
            borderTopRightRadius: '0.3rem',
            overflowY: 'auto'
          }}
        >
          {items.map(data => (
            <Card key={nanoid(10)} data={data} />
          ))}
        </section>
        <WarnDelete wish={wish} runDelete={sendToDelete} />
      </div>
    </Modaldiv>
  )
}
