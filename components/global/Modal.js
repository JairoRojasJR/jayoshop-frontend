import PropTypes from 'prop-types'
import { useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { runTransition } from '@/services/public/utils/transition'

let modalRoot = null
let modalHTML = null

const transitions = (modal, action) => [
  {
    element: modal,
    properties: { opacity: [1, 0] },
    display: { action }
  }
]

export const openModal = ({ Component }) => {
  if (!Component) throw new Error('Component is required')
  modalRoot.render(<></>)
  setTimeout(() => {
    modalRoot.render(Component)
    document.body.classList.add('no-scroll')
    runTransition(transitions(modalHTML, 'show'), 0)
  }, 1)
}

export const closeModal = () => {
  document.body.classList.remove('no-scroll')
  runTransition(transitions(modalHTML, 'hidde'), 1)
}

export function Modaldiv({ children, beforeClose }) {
  return (
    <div className='h100p w100p owA' style={{ minWidth: 'var(--minWDisplay)' }}>
      <main
        className='pr h100p w100p df fdc jcc aic pgLX'
        onClick={beforeClose || closeModal}
      >
        <div className='pa w100p h100p tp0 lf0 bcD' style={{ opacity: 0.9 }} />
        <div
          className='pr w100p'
          style={{ maxHeight: '100%' }}
          onClick={e => e.stopPropagation()}
        >
          {children}
        </div>
      </main>
    </div>
  )
}

Modaldiv.propTypes = {
  children: PropTypes.object.isRequired,
  beforeClose: PropTypes.func
}

export default function Modal() {
  useEffect(() => {
    if (modalRoot) return
    const modalHtml = document.getElementById('globalModal')
    modalRoot = createRoot(modalHtml)
    modalHTML = document.getElementById('globalModal')
  }, [])

  return (
    <dialog
      id='globalModal'
      className='w100p h100p bcT dn pf owA'
      style={{
        border: 'none',
        opacity: '0',
        transition: 'opacity var(--timeFlash)',
        zIndex: 5000
      }}
      onClick={closeModal}
    />
  )
}
