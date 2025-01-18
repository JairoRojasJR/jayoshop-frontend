'use client'

import { createContext, useContext, useRef } from 'react'
import { createPortal } from 'react-dom'
import useModal, { type UseModal } from '@/hooks/modal'
import style from '@/css/Modal.module.css'

const ModalContext = createContext<UseModal>(undefined as unknown as UseModal)

export default function ModalProvider({
  children
}: {
  children: React.ReactNode
}): JSX.Element {
  const modalRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const backdropRef = useRef<HTMLDivElement>(null)

  const modal = useModal(modalRef, contentRef, backdropRef)

  return (
    <ModalContext.Provider value={modal}>
      <div id='modal' ref={modalRef} className={style.modal}>
        <div ref={backdropRef} className='backdrop' />
        <div
          id='modalContent'
          ref={contentRef}
          className={style.modal__content__container}
        />
      </div>
      {children}
    </ModalContext.Provider>
  )
}

type ModalBackdropProps = { closing: () => void }

export function ModalBackdrop({ closing }: ModalBackdropProps): JSX.Element {
  const { $modal } = useModalContext()
  if ($modal === null) return <></>

  return createPortal(
    <div
      className='backdrop preventClose'
      onClick={e => {
        e.stopPropagation()
        closing()
      }}
    />,
    $modal
  )
}

export function useModalContext(): UseModal {
  return useContext(ModalContext)
}
