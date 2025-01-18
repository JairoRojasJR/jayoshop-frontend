import { useEffect, useState } from 'react'
import { type Hook } from '@/context/Products'
import type { Product, Section } from '@/types/server'

export default function useProducts(
  products: Product[],
  sections: Section[],
  currentSection: string | string[] | undefined
): Hook {
  const [current, setCurrent] = useState(products)
  const [multiSelect, setMultiSelect] = useState(false)
  const [selecteds, setSelecteds] = useState<string[]>([])

  const printAdd: Hook['printAdd'] = added => setCurrent([...current, added])

  const printUpdate: Hook['printUpdate'] = updated => {
    const { _id } = updated
    const up = current.map(product => (product._id === _id ? updated : product))
    setCurrent(up)
  }

  const printDelete: Hook['printDelete'] = async _id => {
    let filter: (product: Product) => void
    if (Array.isArray(_id)) {
      filter = product => !_id.includes(product._id)
      setSelecteds([])
    } else filter = product => product._id !== _id

    const del = current.filter(filter)
    setCurrent(del)
  }

  const toggleMultiSelect = (): void => setMultiSelect(!multiSelect)

  const selectProduct: Hook['selectProduct'] = _id => {
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
    setCurrent(products)
  }, [products])

  return {
    currentSection,
    current,
    sections,
    printAdd,
    multiSelect,
    printUpdate,
    printDelete,
    toggleMultiSelect,
    selectProduct,
    selecteds
  }
}
