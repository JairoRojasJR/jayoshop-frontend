import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { useIsAuthContext } from '@/context/isAuth'
import Layout from '@/components/global/Layout'
import Adminlayout from '@/components/admin/main/AdminLayout'
import PlusNavLayout from '@/components/admin/main/PlusNavLayout'
import NewProduct from '@/components/admin/main/NewProduct'
import SectionsComponent from '@/components/admin/main/Sections'
import SubNav from '@/components/admin/utils/SubNav'
import CardProduct from '@/components/utils/CardProduct'
import Actions from '@/components/admin/main/Actions'
import { MultiTrash, runMultiTrash } from '@/components/admin/main/Trash'
import { getSections, getProducts } from '@/services/public/inventory'
import { checkAuth, deleteProduct } from '@/services/admin/inventory'
import type {
  AdminAction,
  AdminLogistics,
  Product,
  OnSuccesServer,
  Sections,
  Toggle,
  AdminLogisticsObject
} from '@/types'
import { type GetServerSidePropsContext } from 'next'

export default function Inventory(): JSX.Element {
  const router = useRouter()
  const { isAuthContext } = useIsAuthContext()
  const [sections, setSections] = useState<Sections>([])
  const [products, setProducts] = useState<Product[]>([])
  const [currentSection, setCurrentSection] = useState('')
  const [plusInAction, setPlusInAction] = useState<AdminLogistics>('')
  const [action, setAction] = useState<AdminAction>('')
  const [selecteds, setSelecteds] = useState<Product[]>([])

  const reloadSections = (): void => {
    getSections(setSections).catch((e: Error) => {
      console.log(e.message)
    })
  }

  const reloadProducts: OnSuccesServer = (): void => {
    getProducts({ section: currentSection }, setProducts).catch((e: Error) => {
      console.log(e.message)
    })
  }

  const updateActionSelected = (
    updated: AdminAction,
    resetSelecteds: Toggle
  ): void => {
    setAction(updated)
    if (resetSelecteds === 1) setSelecteds([])
  }

  const runMultiTrashProducts = (): void => {
    const reset = (): void => {
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
    const section = query.section ?? 'Todo'

    if (typeof section === 'string') {
      if (selecteds.length > 1) setSelecteds([])
      if (isAuthContext.serverStatus === 'connected') {
        setCurrentSection(section)
        getSections(setSections).catch((e: Error) => {
          console.log(e)
        })
        getProducts({ section }, setProducts).catch((e: Error) => {
          console.log(e)
        })
      }
      finishedRouter = true
    }
  }, [router, isAuthContext])

  // Html content required
  const plusIn = (): JSX.Element => {
    const options: AdminLogisticsObject[] = [
      { name: 'Nuevo producto' },
      { name: 'Secciones' }
    ]

    return (
      <PlusNavLayout
        options={options}
        plusInAction={plusInAction}
        setPlusInAction={setPlusInAction}
      >
        {plusInAction === options[0].name ? (
          <NewProduct reloadProducts={reloadProducts} />
        ) : null}
        {plusInAction === options[1].name ? (
          <SectionsComponent
            sections={sections}
            reloadSections={reloadSections}
            reloadProducts={reloadProducts}
          />
        ) : null}
      </PlusNavLayout>
    )
  }

  const plusOut = (): JSX.Element => (
    <SubNav sections={sections} pathBrowsing='/admin/inventario' />
  )

  return (
    <Layout>
      <Head>
        <title>Admin - Inventario</title>
      </Head>
      {isAuthContext.serverStatus === 'connected' &&
      isAuthContext.isAdminAuthenticated ? (
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
      ) : null}
    </Layout>
  )
}

type ServerSideProps = {
  props: {
    isAuthenticated: boolean
  }
}

export async function getServerSideProps(
  context: GetServerSidePropsContext
): Promise<ServerSideProps> {
  return await checkAuth(context)
}
