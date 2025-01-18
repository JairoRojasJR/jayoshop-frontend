import { type Metadata } from 'next'
import ProductsProvider from '@/context/Products'
import { ProductCard } from '@/components/Cards'
import { SectionsNav } from '@/components/Shorts'
import { getProducts, getSections } from '@/services/inventory'
import style from '@/css/Products.module.css'

export const metadata: Metadata = { title: 'Productos' }

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function Productos({
  searchParams
}: Props): Promise<JSX.Element> {
  const sections = await getSections()
  const products = await getProducts()

  const { section } = await searchParams

  return (
    <ProductsProvider
      currentSection={section}
      products={products}
      sections={sections}
    >
      <SectionsNav
        path='/productos'
        currentSection={section}
        sections={sections}
      />
      <section className={style.products}>
        {products.map(
          product =>
            (section === product.section || section === undefined) && (
              <ProductCard key={`Productos-${product._id}`} data={product} />
            )
        )}
      </section>
    </ProductsProvider>
  )
}
