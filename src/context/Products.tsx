'use client'
import { createContext, useContext } from 'react'
import useProducts from '@/hooks/products'
import type { Product, Section } from '@/types/server'

type Props = {
  children: React.ReactNode
  products: Product[]
  sections: Section[]
  currentSection: string | string[] | undefined
}

export type Hook = {
  currentSection: string | string[] | undefined
  current: Product[]
  sections: Section[]
  multiSelect: boolean
  selecteds: string[]
  printAdd: (added: Product) => void
  printUpdate: (updated: Product) => void
  printDelete: (_id: string | string[]) => void
  toggleMultiSelect: () => void
  selectProduct: (_id: string) => void
}

const ProductsContext = createContext<Hook>(undefined as unknown as Hook)

export default function ProductsProvider({
  children,
  products,
  sections,
  currentSection
}: Props): JSX.Element {
  const hook = useProducts(products, sections, currentSection)

  return (
    <ProductsContext.Provider value={hook}>{children}</ProductsContext.Provider>
  )
}

export function useProductsContext(): Hook {
  return useContext(ProductsContext)
}
