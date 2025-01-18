import { type Metadata } from 'next'
import ProductsProvider from '@/context/Products'
import { Products } from '@/components/InventoryMain'
import { SectionsNav } from '@/components/Shorts'
import { getProducts, getSections } from '@/services/inventory'

export const metadata: Metadata = { title: 'Productos admin - JayoShop' }

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function Productos({
  searchParams
}: Props): Promise<JSX.Element> {
  const { section } = await searchParams

  const products = await getProducts(
    typeof section === 'string' ? { section } : undefined
  )
  const sections = await getSections()

  return (
    <ProductsProvider
      products={products}
      sections={sections}
      currentSection={section}
    >
      <SectionsNav
        path='/admin/inventario/productos'
        currentSection={section}
        sections={sections}
      />
      <Products />
    </ProductsProvider>
  )
}
