import PropTypes from 'prop-types'
import { Modaldiv, openModal, closeModal } from '@/components/global/Modal'
import WarnDelete from '@/components/admin/utils/WarnDelete'
import { jtoast } from '@/packages/jtoast/Jtoast'
import { nanoid } from 'nanoid'

export default function Trash({ Card, data, wish, send, onSuccess }) {
  const sendToDelete = async () => {
    const res = await send(data)
    if (res.error) return jtoast(res.error)
    jtoast(res.message)
    onSuccess()
    closeModal()
  }

  return (
    <Modaldiv>
      <main className='df fdc' onClick={e => e.stopPropagation()}>
        <Card data={data} />
        <WarnDelete wish={wish} runDelete={sendToDelete} />
      </main>
    </Modaldiv>
  )
}

Trash.propTypes = {
  Card: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  wish: PropTypes.string.isRequired,
  send: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired
}

export const runMultiTrash = (isMultipleTrashReady, Component) => {
  if (!isMultipleTrashReady) return jtoast('👇 Seleccione al menos dos items')
  openModal({ Component })
}

export function MultiTrash({ Card, items, target, wish, send, onSuccess }) {
  const sendToDelete = async () => {
    const res = await send(items)

    if (res.error) {
      const notifications = [
        `${res.deleting.count} eliminados`,
        `Surgió un error al eliminar (${res.deleting[target].name})`,
        `Error: ${res.error}`
      ]

      notifications.map(notification => {
        return jtoast(notification, { duration: 5000 })
      })

      if (res.deleting.count) onSuccess()
      return closeModal()
    }

    jtoast(res.message)
    onSuccess()
    closeModal()
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

MultiTrash.propTypes = {
  Card: PropTypes.func.isRequired,
  items: PropTypes.array.isRequired,
  target: PropTypes.string.isRequired,
  wish: PropTypes.string.isRequired,
  send: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired
}
