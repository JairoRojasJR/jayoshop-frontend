import PropTypes from 'prop-types'
import { useRef } from 'react'
import { runTransition } from '@/services/public/utils/transition'
import { jtoast } from '@/packages/jtoast/Jtoast'
import { nanoid } from 'nanoid'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro'

export default function Actions({
  selected,
  updateSelected,
  isMultiTrashReady,
  runMultiTrash
}) {
  const btnRunMultiTrash = useRef(null)

  const switchBtnRunMultiTrash = toggle => {
    const transitions = [
      {
        element: btnRunMultiTrash.current,
        properties: { top: ['0', '-150%'] },
        display: { onStart: 'flex', onEnd: 'none' }
      }
    ]
    runTransition(transitions, toggle)
  }

  const updateAction = (action, notification) => {
    let newNotification
    const trashSelected = selected === 'eliminar'
    const multiTrashSelected = selected === 'multiEliminar'
    const isActionMultiTrash = action === 'multiEliminar'
    const trashActivated = trashSelected || multiTrashSelected

    const imposible = isActionMultiTrash && !trashActivated
    const disabling = action === selected

    let updated
    if (imposible) return jtoast('💔 Función solo disponible con papelera')
    else if (disabling) {
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
    jtoast(newNotification)
    updateSelected(updated, toggleUpdate)
  }

  // const actionsAdmin = {
  //   edit: {
  //     icon: [solid('pencil')],
  //     msgOnActive: '🖊 Seleccione un item para editarlo'
  //   },
  //   trash: {
  //     icon: [solid('trash')],
  //     msgOnActive: '🗑 Seleccione un item para eliminarlo',
  //     children: btnReady ? getBtnReady() : null
  //   },
  //   multipleCheck: {
  //     icon: [solid('square-check'), solid('square-check')],
  //     icons: 2,
  //     msgOnActive: '👇 Seleccione los items a eliminar',
  //     imposible: '💔 Función solo disponible con papelera'
  //   }
  // }

  // Action Component
  const Action = ({ children, name, icon, notification }) => {
    const style = { opacity: 0.5 }

    const match = name === selected
    const trashSelected = selected === 'eliminar'
    const multiTrashSelected = selected === 'multiEliminar'
    const isActionTrashActive = trashSelected || multiTrashSelected
    const isActionActive = match || (name === 'eliminar' && isActionTrashActive)

    if (isActionActive) {
      style.opacity = 1
      style.outline = 'var(--remS) solid var(--dark)'
    }

    return (
      <article
        className='bcTurq crD pgM brS df jcc cp pr'
        onClick={() => updateAction(name, notification)}
        style={style}
      >
        {!Array.isArray(icon) ? (
          <FontAwesomeIcon icon={icon} />
        ) : (
          icon.map(i => <FontAwesomeIcon key={nanoid(5)} icon={i} />)
        )}
        {children}
      </article>
    )
  }

  Action.propTypes = {
    name: PropTypes.string.isRequired,
    icon: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
    notification: PropTypes.string.isRequired,
    children: PropTypes.element
  }

  // Html content required
  const btnRunMultiTrashStyle = () => {
    const style = { border: '0.3rem solid var(--secondary)' }
    if (!isMultiTrashReady) style.filter = 'grayScale(.6)'
    return style
  }

  return (
    <section className='pgM bcP df jcse brS'>
      <Action
        name='editar'
        icon={solid('pencil')}
        notification='🖊 Seleccione un item para editarlo'
      />
      <article className='pr df jcc'>
        <div
          ref={btnRunMultiTrash}
          className='pa tp0'
          onClick={e => e.stopPropagation()}
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
          icon={solid('trash')}
          notification='🗑 Seleccione un item para eliminarlo'
        />
      </article>
      <Action
        name='multiEliminar'
        icon={[solid('square-check'), solid('square-check')]}
        notification='👇 Seleccione los items a eliminar'
      />
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

Actions.propTypes = {
  selected: PropTypes.string.isRequired,
  updateSelected: PropTypes.func.isRequired,
  isMultiTrashReady: PropTypes.bool.isRequired,
  runMultiTrash: PropTypes.func
}
