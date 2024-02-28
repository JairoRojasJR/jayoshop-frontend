'use client'

import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Layout from '@/components/global/Layout'
import SubNav from '@/components/admin/utils/SubNav'
import CardProduct from '@/components/utils/CardProduct'
import { getProducts, getSections } from '@/services/public/inventory'
import type { Products, Sections } from '@/types'

export default function Productos(): JSX.Element {
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<Products>([])
  const [currentSection, setCurrentSection] = useState<string>('')
  const [sections, setSections] = useState<Sections>([])
  const headerRef: React.MutableRefObject<HTMLElement | null> = useRef(null)
  const mainRef: React.MutableRefObject<HTMLElement | null> = useRef(null)

  useEffect(() => {
    const navHTML = globalThis.navMainHTML
    if (headerRef.current !== null && mainRef.current !== null) {
      headerRef.current.style.top = `${navHTML.clientHeight}px`
      mainRef.current.style.marginTop = `${headerRef.current.clientHeight}px`
    }
    getSections(setSections).catch((e: Error) => {
      console.log(e.message)
    })
  }, [])

  let finishedRouter = false
  useEffect(() => {
    if (finishedRouter) return
    const section = searchParams.get('section') ?? 'Todo'
    setCurrentSection(section)
    getSections(setSections).catch((e: Error) => {
      console.log(e.message)
    })
    getProducts({ section }, setProducts).catch((e: Error) => {
      console.log(e)
    })
    finishedRouter = true
  }, [searchParams])

  return (
    <Layout>
      <header ref={headerRef} className='fixed left-0 z-[900] w-full px-4'>
        <SubNav sections={sections} pathBrowsing='/productos' />
      </header>
      <section
        ref={mainRef}
        className='flex flex-col gap-2 p-8 min-[500px]:grid min-[500px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
      >
        {products?.map(product => {
          const { _id } = product
          return (
            <CardProduct
              key={`productosCardProduct-${_id}`}
              data={product}
              showSection={currentSection === 'Todo'}
            />
          )
        })}
      </section>
    </Layout>
  )
}
