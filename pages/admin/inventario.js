import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Layout from '@/components/global/Layout'
import Adminlayout from '@/components/admin/main/AdminLayout'
import PlusNavLayout from '@/components/admin/main/PlusNavLayout'
import NewProduct from '@/components/admin/main/NewProduct'
import Sections from '@/components/admin/main/Sections'
import SubNav from '@/components/admin/utils/SubNav'
import CardProduct from '@/components/utils/CardProduct'
import Actions from '@/components/admin/main/Actions'
import { MultiTrash, runMultiTrash } from '@/components/admin/main/Trash'
import { getSections, getProducts } from '@/services/public/inventory'
import { checkAuth, deleteProduct } from '@/services/admin/inventory'

export default function Inventory() {
  const router = useRouter()
  const [sections, setSections] = useState([])
  const [products, setProducts] = useState([])
  const [currentSection, setCurrentSection] = useState('')
  const [plusInAction, setPlusInAction] = useState('')
  const [action, setAction] = useState('')
  const [selecteds, setSelecteds] = useState([])

  const reloadSections = () => getSections(setSections)
  const reloadProducts = () => {
    getProducts({ section: currentSection }, setProducts)
  }

  const updateActionSelected = (updated, resetSelecteds) => {
    setAction(updated)
    if (resetSelecteds) setSelecteds([])
  }

  const runMultiTrashProducts = () => {
    const reset = () => {
      reloadProducts()
      setSelecteds([])
    }

    const Component = (
      <MultiTrash
        Card={CardProduct}
        items={selecteds}
        wish='eliminar estos productos'
        target='product'
        send={deleteProduct}
        onSuccess={reset}
      />
    )

    runMultiTrash(selecteds.length > 1, Component)
  }

  let finishedRouter = false
  useEffect(() => {
    if (finishedRouter) return
    const query = router.query
    const section = query.section !== undefined ? query.section : 'Todo'
    if (selecteds.length > 1) setSelecteds([])
    setCurrentSection(section || 'Todo')
    getSections(setSections)
    getProducts({ section }, setProducts)
    finishedRouter = true
  }, [router])

  // Html content required
  const plusIn = () => {
    const options = ['Nuevo producto', 'Secciones']
    return (
      <PlusNavLayout
        options={options}
        plusInAction={plusInAction}
        setPlusInAction={setPlusInAction}
      >
        {plusInAction === options[0] ? (
          <NewProduct products={products} reloadProducts={reloadProducts} />
        ) : null}
        {plusInAction === options[1] ? (
          <Sections
            sections={sections}
            reloadSections={reloadSections}
            reloadProducts={reloadProducts}
          />
        ) : null}
      </PlusNavLayout>
    )
  }

  const plusOut = () => <SubNav sections={sections} />

  return (
    <Layout>
      <Head>
        <title>Admin - Inventario</title>
      </Head>
      <Adminlayout plusIn={plusIn()} plusOut={plusOut()}>
        <section className='df fdc gpM'>
          {products.map(product => (
            <CardProduct
              key={`inventarioCardProduct-${product._id}`}
              data={product}
              action={action}
              selecteds={selecteds}
              setSelecteds={setSelecteds}
              reloadProducts={reloadProducts}
              showSection={currentSection === 'Todo'}
            />
          ))}
        </section>
        {products.length > 0 ? (
          <section
            className='actions w100p pf lf0 bm0'
            style={{
              minWidth: 'var(--minWDisplay)',
              padding: '0 var(--remLX)',
              zIndex: 50
            }}
          >
            <Actions
              selected={action}
              updateSelected={updateActionSelected}
              isMultiTrashReady={selecteds.length > 1}
              runMultiTrash={runMultiTrashProducts}
            />
          </section>
        ) : null}
      </Adminlayout>
    </Layout>
  )
}

export async function getServerSideProps(context) {
  return checkAuth(context)
}
