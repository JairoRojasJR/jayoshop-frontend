import PropTypes from 'prop-types'
import { useEffect, useRef, useState } from 'react'
import { runTransition } from '@/services/utils/transition'
import { nanoid } from 'nanoid'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro'

export default function PlusNavLayout({
  children,
  options,
  plusInAction,
  setPlusInAction
}) {
  const [status, setStatus] = useState('close')
  const [initialButtonsWidth, setInitialButtonsWidth] = useState({})
  const buttonsContainerRef = useRef(null)
  const optionInActionRef = useRef(null)

  const resizingPlusOption = option => {
    setPlusInAction(option)

    const optionInActionHTML = optionInActionRef.current
    setTimeout(() => {
      const currentHeight = `${optionInActionHTML.clientHeight}px`
      const currentHeightOfContent = `${optionInActionHTML.children[0].scrollHeight}px`
      const transitions = [
        {
          element: optionInActionHTML,
          properties: { height: [currentHeightOfContent, currentHeight] }
        }
      ]
      runTransition(transitions, 0)
    }, 1)
  }

  const switchPlusOption = option => {
    const isResizing = status === 'open' && option !== plusInAction
    if (isResizing) return resizingPlusOption(option)

    const closing = status === 'open'
    const toggle = closing ? 1 : 0
    const newStatus = closing ? 'close' : 'open'
    const newPlusInAction = closing ? '' : option

    const runSwitch = () => {
      setPlusInAction(newPlusInAction)
      setStatus(newStatus)
    }

    const transitions = [
      {
        element: optionInActionRef.current,
        properties: { height: ['scrollHeight', '0'] },
        display: { action: [toggle ? 'hidde' : 'show', runSwitch] }
      }
    ]

    runTransition(transitions, toggle)
  }

  useEffect(() => {
    const buttonsContainerHTML = buttonsContainerRef.current
    const buttonsHTML = buttonsContainerHTML.children
    const preInitialButtonsWidth = {}

    for (const button of buttonsHTML) {
      const option = button.textContent
      const width = button.clientWidth
      preInitialButtonsWidth[option] = `${width}px`
    }

    setInitialButtonsWidth(preInitialButtonsWidth)
  }, [])

  // Components required
  function Option({ name }) {
    const className = () => {
      const className = 'pgM brS df jcc gpM cp crD'
      if (plusInAction === name) return `${className} bcDr`
      return `${className} bcTurq`
    }

    return (
      <button
        className={className()}
        style={{ minWidth: initialButtonsWidth[name] }}
        onClick={() => switchPlusOption(name)}
      >
        {plusInAction !== name ? (
          <FontAwesomeIcon icon={solid('plus')} />
        ) : (
          <FontAwesomeIcon icon={solid('minus')} />
        )}
        {status === 'open' && name === plusInAction ? 'Ocultar' : name}
      </button>
    )
  }

  Option.propTypes = {
    name: PropTypes.string.isRequired
  }

  return (
    <article className='w100p df fdc gpL'>
      <header ref={buttonsContainerRef} className='df gpM'>
        {options.map(option => (
          <Option key={nanoid(5)} name={option} />
        ))}
      </header>
      <main
        ref={optionInActionRef}
        className='optionInAction dn fdc owyA'
        style={{
          height: 0,
          transition: 'height var(--timeFlash)',
          maxHeight: '60vh'
        }}
      >
        {children}
      </main>
    </article>
  )
}

PlusNavLayout.propTypes = {
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
  options: PropTypes.array.isRequired,
  plusInAction: PropTypes.string.isRequired,
  setPlusInAction: PropTypes.func.isRequired
}
