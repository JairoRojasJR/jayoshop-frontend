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
    const match = name === selected
    const trashSelected = selected === 'eliminar'
    const multiTrashSelected = selected === 'multieliminar'
    const isActionTrashActive = trashSelected || multiTrashSelected
    const isActionActive = match || (name === 'eliminar' && isActionTrashActive)

    return (
      <article
        className={`relative flex cursor-pointer justify-center rounded-md bg-turquoise p-2 text-dark-100 transition duration-300 hover:bg-skyviolet ${
          isActionActive ? 'opacity-100 outline outline-dark-300' : 'opacity-50'
        }`}
        onClick={() => {
          updateAction(name, notification)
        }}
      >
        {children}
      </article>
    )
  }

  return (
    <section className='m-auto flex max-w-[600px] justify-evenly rounded-md rounded-b-none border-4 border-b-0 border-solid border-dark-300 bg-light-100 p-2 dark:bg-dark-100'>
      <Action name='editar' notification='🖊 Seleccione un item para editarlo'>
        <Edit />
      </Action>
      <article className='relative flex justify-center'>
        <div
          ref={btnRunMultiTrash}
          className='absolute top-0 -z-10 transition-all duration-300'
          onClick={e => {
            e.stopPropagation()
          }}
        >
          <button
            className={`relative rounded-md border-4 border-solid border-dark-300 bg-danger p-2 ${
              isMultiTrashReady ? 'cursor-pointer' : 'grayscale-[0.6]'
            }`}
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
    </section>
  )
}
