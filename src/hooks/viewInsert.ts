import { useEffect, useState } from 'react'
import { useModalContext } from '@/context/Modal'
import { type Hook } from '@/context/ViewInsert'

export type ForShow = { show: boolean; runShow: (show: boolean) => void }

export default function useViewInsert(): Hook {
  const { openModal, closeModal, show, runShow } = useModalContext()
  const [inAction, setInAction] = useState(false)

  const opening: Hook['opening'] = () => {
    runShow(true)
    setInAction(true)
    openModal()
  }

  const closing: Hook['closing'] = () => {
    closeModal()
    runShow(false)
  }

  useEffect(() => {
    if (!show) setInAction(show)
  }, [show])

  return { insert: show && inAction, opening, closing }
}
