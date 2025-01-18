import { useEffect, useState } from 'react'
import { type Hook } from '@/context/Sections'
import type { Section } from '@/types/server'

export default function useSections(sections: Section[]): Hook {
  const [current, setCurrent] = useState(sections)
  const [show, setShow] = useState(false)
  const [multiSelect, setMultiSelect] = useState(false)
  const [selecteds, setSelecteds] = useState<string[]>([])

  const printAdd: Hook['printAdd'] = added => setCurrent([...current, added])

  const printUpdate: Hook['printUpdate'] = updated => {
    const { _id } = updated
    const up = current.map(product => (product._id === _id ? updated : product))
    setCurrent(up)
  }

  const printDelete: Hook['printDelete'] = async _id => {
    let filter: (product: Section) => void
    if (Array.isArray(_id)) {
      filter = product => !_id.includes(product._id)
      setSelecteds([])
    } else filter = product => product._id !== _id

    const del = current.filter(filter)
    setCurrent(del)
  }

  const runShow = (show: boolean): void => setShow(show)

  const toggleMultiSelect = (): void => setMultiSelect(!multiSelect)

  const selectSection: Hook['selectSection'] = _id => {
    if (!multiSelect) return console.warn('Función multiselect desabilitada...')
    let newSelecteds = []
    if (!selecteds.includes(_id)) newSelecteds = [...selecteds, _id]
    else newSelecteds = selecteds.filter(selected => selected !== _id)
    setSelecteds(newSelecteds)
  }

  useEffect(() => {
    if (!multiSelect) setSelecteds([])
  }, [multiSelect])

  useEffect(() => {
    setCurrent(sections)
  }, [sections])

  return {
    current,
    show,
    printAdd,
    multiSelect,
    printUpdate,
    printDelete,
    runShow,
    toggleMultiSelect,
    selectSection,
    selecteds
  }
}
