import { useState, useEffect } from 'react'
import style from '@/css/Modal.module.css'

export type UseModal = {
  $modal: HTMLDivElement | null
  $content: HTMLDivElement | null
  show: boolean
  openModal: () => void
  closeModal: () => void
  runShow: (show: boolean) => void
}

export default function useModal(
  modalRef: React.RefObject<HTMLDivElement>,
  contentRef: React.RefObject<HTMLDivElement>,
  backdropRef: React.RefObject<HTMLDivElement>
): UseModal {
  const [elements, setElements] = useState({
    $modal: modalRef.current,
    $backdrop: backdropRef.current,
    $content: contentRef.current
  })
  const [show, setShow] = useState(false)
  const { $modal, $backdrop, $content } = elements

  const openModal: UseModal['openModal'] = () => {
    $modal?.classList.add(style.modal__open)
  }

  const closeModal: UseModal['closeModal'] = () => {
    $modal?.classList.remove(style.modal__open)
  }

  const runShow = (show: boolean): void => setShow(show)

  useEffect(() => {
    setElements({
      $modal: modalRef.current,
      $backdrop: backdropRef.current,
      $content: contentRef.current
    })
  }, [])

  useEffect(() => {
    $backdrop?.addEventListener('click', e => closeModal())
  }, [$backdrop])

  return {
    $modal,
    $content,
    show,
    openModal,
    closeModal,
    runShow
  }
}
