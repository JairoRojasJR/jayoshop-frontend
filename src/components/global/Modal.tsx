import { useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { runTransition } from '@/services/public/utils/transition'
import type { Transitions } from '@/types'

const transitions = (modal: HTMLElement): Transitions => [
  {
    element: modal,
    properties: {
      from: { opacity: 0 },
      to: { opacity: 1 }
    },
    display: 'run'
  }
]

type OpenModal = { Component: JSX.Element }
export const openModal = ({ Component }: OpenModal): void => {
  MODAL_ROOT.render(<></>)
  setTimeout(() => {
    MODAL_ROOT.render(Component)
    document.body.classList.add('no-scroll')
    runTransition(transitions(MODAL_HTML), 1).catch((e: Error) => {
      console.log(e)
    })
  }, 1)
}

export const closeModal = (): void => {
  document.body.classList.remove('no-scroll')
  runTransition(transitions(MODAL_HTML), 0).catch((e: Error) => {
    console.log(e.message)
  })
}

type ModalDivProps = {
  children: React.ReactNode
  beforeClose?: (e: React.MouseEvent<HTMLElement>) => void
}

export function Modaldiv({
  children,
  beforeClose
}: ModalDivProps): JSX.Element {
  return (
    <div className='size-full min-w-[350px] overflow-auto'>
      <main className='relative flex size-full flex-col items-center justify-center p-8'>
        <div
          className='absolute left-0 top-0 size-full bg-[#01010B] opacity-90'
          onClick={beforeClose ?? closeModal}
        />
        <div
          className='relative h-full'
          onClick={e => {
            e.stopPropagation()
          }}
        >
          {children}
        </div>
      </main>
    </div>
  )
}

export default function Modal(): JSX.Element {
  useEffect(() => {
    if (globalThis.MODAL_ROOT_CREATED) return
    const modalHtml = document.getElementById('globalModal') as HTMLElement
    globalThis.MODAL_HTML = modalHtml
    globalThis.MODAL_ROOT = createRoot(globalThis.MODAL_HTML)
    globalThis.MODAL_ROOT_CREATED = true
  }, [])

  return (
    <dialog
      id='globalModal'
      className='invisible fixed size-full overflow-auto bg-transparent'
      style={{
        border: 'none',
        zIndex: 5000
      }}
    />
  )
}
