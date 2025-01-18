import { useState } from 'react'
import { useViewInsertContext } from '@/context/ViewInsert'
import useAwaiting from '@/hooks/awaiting'
import { jtoast } from '@/packages/jtoast/Jtoast'
import { jtoastAsync } from '@/lib/local'
import type { UpdatedFromInventory } from '@/types/server'
import type { TypingMainInputsEvent } from '@/types/local'

type Hook<T> = {
  awaiting: boolean
  updated: T
  closingOnChanges: boolean
  backdrop: () => void
  update: (e: React.FormEvent<HTMLElement>) => Promise<void>
  typing: (e: TypingMainInputsEvent) => void
  closing: () => void
  hiddenWarn: () => void
}

type Props<T> = {
  data: T
  target: string
  runUpdate: (formData: FormData) => Promise<UpdatedFromInventory<T>>
}

export default function useEditing<T>({
  data,
  target,
  runUpdate
}: Props<T>): Hook<T> {
  const { closing } = useViewInsertContext()
  const { awaiting, enable, disable } = useAwaiting()
  const [updated, setUpdated] = useState(data)
  const [closingOnChanges, setClosingOnChanges] = useState(false)

  const hasChanges = JSON.stringify(data) !== JSON.stringify(updated)

  const backdrop = (): void => {
    if (!hasChanges) closing()
    else setClosingOnChanges(true)
  }

  const typing = (e: TypingMainInputsEvent): void => {
    const input = e.currentTarget
    const { name: field, value } = input

    let updatedValue: string | number = value
    if (input.type === 'file') {
      const files = (input as HTMLInputElement).files

      if (files === null || files.length === 0) {
        updatedValue = (data as { image: string }).image
      } else updatedValue = URL.createObjectURL(files[0])
    }

    if (input.dataset.type === 'number') updatedValue = parseInt(updatedValue)
    const updating = { ...updated, [field]: updatedValue }
    setUpdated(updating)
  }

  const update = async (e: React.FormEvent<HTMLElement>): Promise<void> => {
    e.preventDefault()
    if (!hasChanges) return jtoast('💔No se detectaron cambios')
    disable()
    const form = e.target as HTMLFormElement
    const formData = new FormData(form)

    for (const field in updated) {
      if (field === '_id') continue
      const compare = data[field as keyof T]
      const updatedValue = updated[field as keyof T]
      if (compare === updatedValue) formData.delete(field)
    }

    const callback = async (): Promise<UpdatedFromInventory<T>> => {
      const res = await runUpdate(formData)
      setUpdated(res.updated)
      return res
    }

    jtoastAsync(`Actualizando ${target}...`, callback, enable)
  }

  const hiddenWarn = (): void => setClosingOnChanges(false)

  return {
    awaiting,
    updated,
    closingOnChanges,
    backdrop,
    update,
    typing,
    closing,
    hiddenWarn
  }
}
