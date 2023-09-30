import { useRef } from 'react'
import { runTransition } from '@/services/public/utils/transition'
import { jtoast } from '@/packages/jtoast/Jtoast'
import type { AdminAction, Toggle, Transitions } from '@/types'
import Edit from '@/svg/Edit'
import Trash from '@/svg/Trash'
import ListCheck from '@/svg/List-check'

type Props = {
  selected: AdminAction
  updateSelected: (updated: AdminAction, toggle: Toggle) => void
  isMultiTrashReady: boolean
  runMultiTrash: (e: React.MouseEvent) => void
}

export default function Actions({
  selected,
  updateSelected,
  isMultiTrashReady,
  runMultiTrash
}: Props): JSX.Element {
  type Ref = React.MutableRefObject<HTMLDivElement | null>
  const btnRunMultiTrash: Ref = useRef(null)

  const switchBtnRunMultiTrash = (toggle: Toggle): void => {
    const btnRunMultiTrasHTML = btnRunMultiTrash.current
    if (btnRunMultiTrasHTML === null) return

    const transitions: Transitions = [
      {
        element: btnRunMultiTrasHTML,
        properties: { from: { top: '0' }, to: { top: '-150%' } },
        display: 'run'
      }
    ]
    runTransition(transitions, toggle).catch((e: Error) => {
      console.log(e)
    })
  }

  const updateAction = (action: AdminAction, notification: string): void => {
    let newNotification
    const trashSelected = selected === 'eliminar'
    const multiTrashSelected = selected === 'multieliminar'
    const isActionMultiTrash = action === 'multieliminar'
    const trashActivated = trashSelected || multiTrashSelected

    const imposible = isActionMultiTrash && !trashActivated
    const disabling = action === selected

    let updated: AdminAction
    if (imposible) {
      jtoast('💔 Función solo disponible con papelera')
      return
    } else if (disabling) {
      newNotification = `🚫 Función (${action}) deshabilitada`
      if (multiTrashSelected) updated = 'eliminar'
      else updated = ''
    } else {
      newNotification = notification
      updated = action
    }

    let disablingMultiTrash = isActionMultiTrash && disabling
    if (!isActionMultiTrash && multiTrashSelected) disablingMultiTrash = true
    const activatingMultiTrash = isActionMultiTrash && !disabling

    if (activatingMultiTrash) switchBtnRunMultiTrash(1)
    else if (disablingMultiTrash) switchBtnRunMultiTrash(0)

    const toggleUpdate = disablingMultiTrash ? 1 : 0
    jtoast(newNotification, { clean: true })
    updateSelected(updated, toggleUpdate)
  }

  // Action Component
  type ActionProps = {
    children: React.ReactNode
    name: AdminAction
    notification: string
  }

  const Action = ({
    children,
    name,
    notification
  }: ActionProps): JSX.Element => {
    const style: React.CSSProperties = { opacity: 0.5 }

    const match = name === selected
    const trashSelected = selected === 'eliminar'
    const multiTrashSelected = selected === 'multieliminar'
    const isActionTrashActive = trashSelected || multiTrashSelected
    const isActionActive = match || (name === 'eliminar' && isActionTrashActive)

    if (isActionActive) {
      style.opacity = 1
      style.outline = 'var(--remS) solid var(--darksecondary)'
    }

    return (
      <article
        className='bcTurq crD pgM brS df jcc cp pr'
        onClick={() => {
          updateAction(name, notification)
        }}
        style={style}
      >
        {children}
      </article>
    )
  }

  // Html content required
  const btnRunMultiTrashStyle = (): React.CSSProperties => {
    const style: React.CSSProperties = {
      border: '0.3rem solid var(--secondary)'
    }
    if (!isMultiTrashReady) style.filter = 'grayScale(.6)'
    return style
  }

  return (
    <section className='pgM bcP df jcse brS'>
      <Action name='editar' notification='🖊 Seleccione un item para editarlo'>
        <Edit />
      </Action>
      <article className='pr df jcc'>
        <div
          ref={btnRunMultiTrash}
          className='pa tp0'
          onClick={e => {
            e.stopPropagation()
          }}
        >
          <button
            className={`${isMultiTrashReady ? 'cp' : ''} pr pgM brS bcDr`}
            style={btnRunMultiTrashStyle()}
            onClick={runMultiTrash}
          >
            Eliminar
          </button>
        </div>
        <Action
          name='eliminar'
          notification='🗑 Seleccione un item para eliminarlo'
        >
          <Trash />
        </Action>
      </article>
      <Action
        name='multieliminar'
        notification='👇 Seleccione los items a eliminar'
      >
        <ListCheck />
      </Action>
      <style jsx>{`
        section {
          border: var(--remS) solid var(--darksecondary);
          border-bottom-left-radius: 0;
          border-bottom-right-radius: 0;
        }

        div {
          z-index: -1;
          transition: top var(--timeFlash);
        }
      `}</style>
    </section>
  )
}
