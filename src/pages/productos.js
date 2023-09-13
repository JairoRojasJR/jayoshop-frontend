import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import Layout from '@/components/global/Layout'
import SubNav from '@/components/admin/utils/SubNav'
import CardProduct from '@/components/utils/CardProduct'
import { getProducts, getSections } from '@/services/public/inventory'

export default function Productos() {
  const router = useRouter()
  const [products, setProducts] = useState([])
  const [currentSection, setCurrentSection] = useState([])
  const [sections, setSections] = useState([])
  const headerRef = useRef(null)
  const mainRef = useRef(null)

  useEffect(() => {
    const navHTML = globalThis.navMainHTML
    headerRef.current.style.top = `${navHTML.clientHeight}px`
    mainRef.current.style.marginTop = `${headerRef.current.clientHeight}px`
    getSections(setSections)
  }, [])

  let finishedRouter = false
  useEffect(() => {
    if (finishedRouter === true) return
    const query = router.query
    const section = query.section !== undefined ? query.section : 'Todo'
    setCurrentSection(section || 'Todo')
    getSections(setSections)
    getProducts({ section }, setProducts)
    finishedRouter = true
  }, [router])

  return (
    <Layout>
      <header
        ref={headerRef}
        className='pf lf0 w100p'
        style={{ padding: '0 var(--remLX)', zIndex: 900 }}
      >
        <SubNav sections={sections} pathBrowsing='/productos' />
      </header>
      <main ref={mainRef} className='pgLX df fdc gpM'>
        {products.map(product => {
          const { _id } = product
          return (
            <CardProduct
              key={`productosCardProduct-${_id}`}
              data={product}
              showSection={currentSection === 'Todo'}
            />
          )
        })}
      </main>
    </Layout>
  )
}
