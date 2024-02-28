'use client'

import { useState, useEffect, Fragment } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import { useIsAuthContext } from '@/context/isAuth'
import Layout from '@/components/global/Layout'
import AdminLayout from '@/components/admin/main/AdminLayout'
import { invoiceProduct } from '@/services/admin/inventory'
import { getProducts } from '@/services/public/inventory'
import { jtoast } from '@/packages/jtoast/Jtoast'
import {
  type InvoiceProduct,
  type GetProductServer,
  type Product
} from '@/types'
// import { type GetServerSidePropsContext } from 'next'
import { IS_PROD_MODE, STREAM_IMAGE } from '@/app/consts'

export default function Vender(): JSX.Element {
  const { isAuthContext } = useIsAuthContext()
  const [topStickyHeadTable, setTopStickyHeadTable] = useState(0)

  type ProductBilling = { data: Product; cuantity: number }
  const [productsBilling, setProductsBilling] = useState<ProductBilling[]>([])
  const [totalPayable, setTotalPayable] = useState(0)

  const fixTopStickyHeadTable = (
    newTopSubNav: number,
    heightSubNav: number
  ): void => {
    const newTopHeadTable = newTopSubNav + heightSubNav
    setTopStickyHeadTable(newTopHeadTable)
  }

  const addToInvoice = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const entries = Object.fromEntries(new FormData(form)) as unknown
    const data = entries as GetProductServer<Product>
    if (IS_PROD_MODE) form.reset()

    const barcode = data.barcode
    const noBarcode = barcode === undefined
    if (noBarcode) throw new Error('Error al obtener el código de barras')

    const product = await getProducts({ barcode })

    if (Array.isArray(product)) {
      const notification = `😥No se encontró el producto con el código de barras (${barcode})`
      jtoast(notification)
      return
    } else if (product.cuantity === 0) {
      jtoast(`Producto (${product.name}) agotado`)
      return
    }

    const alreadyAdded = productsBilling.findIndex(product => {
      return product.data.barcode === parseInt(barcode)
    })

    if (alreadyAdded !== -1) {
      const prevProductsBilling = [...productsBilling]
      const product = prevProductsBilling[alreadyAdded]
      const stock = product.data.cuantity
      if (product.cuantity === stock) {
        jtoast('Producto agotado')
        return
      }

      product.cuantity += 1
      setProductsBilling(prevProductsBilling)
      return
    }

    const updatedProductsBilling = [
      ...productsBilling,
      { data: product, cuantity: 1 }
    ]

    setProductsBilling(updatedProductsBilling)
  }

  const sendToInvoice = async (
    e: React.MouseEvent<HTMLButtonElement>
  ): Promise<void> => {
    e.preventDefault()
    const productsToInvoice: InvoiceProduct[] = []
    productsBilling.forEach(product => {
      const { data, cuantity } = product
      productsToInvoice.push({ _id: data._id, cuantity })
    })

    const res = await invoiceProduct(productsToInvoice)
    if (res.error !== undefined) {
      jtoast(`Error: ${res.error}`, { duration: 6000 })
    } else if (res.message !== undefined) {
      setProductsBilling([])
      jtoast(res.message)
    }
  }

  useEffect(() => {
    let prevTotalPayable = 0
    productsBilling.forEach(product => {
      const { price } = product.data
      const { cuantity } = product
      prevTotalPayable += price * cuantity
    })

    setTotalPayable(prevTotalPayable)
  }, [productsBilling])

  return (
    <Layout>
      <Head>
        <title>Admin - Vender</title>
      </Head>
      {isAuthContext.serverStatus === 'connected' ? (
        <AdminLayout onChangeSubNavTop={fixTopStickyHeadTable}>
          <div className='mx-auto flex w-full max-w-[400px] flex-col rounded-md border-4 border-solid border-dark-300'>
            <form
              id='billing'
              className='flex flex-col items-center gap-2 border-b-2 border-dark-300 bg-light-200 p-2 dark:bg-dark-200'
              onSubmit={e => {
                addToInvoice(e).catch((e: Error) => {
                  console.log(e.message)
                })
              }}
            >
              <label className='cursor-pointer' htmlFor='barcode'>
                Código de barras
              </label>
              <input
                id='barcode'
                className='rounded-md bg-dark-200 p-2 text-light-200 focus:shadow-skyblue focus:outline-none dark:bg-light-200 dark:text-dark-200'
                name='barcode'
                placeholder='Click aquí y escanear'
                type='number'
              />
            </form>
            {productsBilling.length === 0 ? (
              <section className='flex flex-col items-center gap-2 bg-light-200 p-2 dark:bg-dark-200'>
                <span>
                  👆Haga clic en la entrada anterior y escaneé el código de
                  barras de un producto para agregarlo a la facturación
                </span>
                <Image
                  className='rounded-md'
                  alt='lector de codigo de barras'
                  src='/lector-de-codigo-de-barras.jpg'
                  width={100}
                  height={100}
                />
              </section>
            ) : (
              <>
                <table
                  cellSpacing={0}
                  className='rounded-md bg-light-200 p-4 dark:bg-dark-200'
                >
                  <thead
                    className='sticky z-50 rounded-md bg-light-200 transition-all duration-300 dark:bg-dark-200'
                    style={{
                      top: `${topStickyHeadTable}px`
                    }}
                  >
                    <tr>
                      <th colSpan={2} />
                      <th>Precio</th>
                      <th>Cant.</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productsBilling.map(product => {
                      const { _id, name, image, price } = product.data
                      const { cuantity } = product
                      const streamProductImage = `${STREAM_IMAGE}/${image}`

                      return (
                        <Fragment key={`venderFragment-${_id}`}>
                          <tr>
                            <td className='px-2' colSpan={5}>
                              <div className='grid aspect-[12/5] w-full grid-cols-[30%_1fr] items-center gap-2 rounded-md bg-dark-300 p-2'>
                                <div className='relative size-full'>
                                  <Image
                                    className='rounded-md object-cover'
                                    alt={name}
                                    loader={data =>
                                      `${streamProductImage}?width=${data.width}`
                                    }
                                    src={streamProductImage}
                                    fill
                                    sizes={`
                                  (max-width: 768px) 100vw,
                                  (max-width: 1200px) 50vw,
                                  33vw
                                `}
                                  />
                                </div>
                                <span className='text-light-200'>{name}</span>
                              </div>
                            </td>
                          </tr>
                          <tr className='text-right'>
                            <td colSpan={2} style={{ width: '30%' }} />
                            <td>{price}$</td>
                            <td className='border-l-4 border-dark-300'>
                              x{cuantity} / {product.data.cuantity}
                            </td>
                            <td className='border-l-4 border-dark-300 pr-2'>
                              {(price * cuantity).toFixed(2)}$
                            </td>
                          </tr>
                        </Fragment>
                      )
                    })}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td className='bg-dark-300 p-2' colSpan={5}>
                        <div className='flex items-center justify-end bg-dark-300'>
                          <div className='rounded-md bg-dark-200 px-4 py-2 text-light-200'>
                            <span className='rounded-md p-2'>
                              Total a pagar:
                            </span>
                            <span className='rounded-md text-turquoise'>
                              {totalPayable.toFixed(2)}$
                            </span>
                          </div>
                        </div>
                      </td>
                    </tr>
                  </tfoot>
                </table>
                <section className='rounded-md bg-light-200 p-2 text-center dark:bg-dark-200'>
                  <button
                    type='submit'
                    className='cursor-pointer rounded-md bg-turquoise px-4 py-2 text-dark-200 transition duration-300 hover:scale-105 hover:shadow-skyviolet'
                    onClick={e => {
                      sendToInvoice(e).catch((e: Error) => {
                        console.log(e.message)
                      })
                    }}
                  >
                    Facturar
                  </button>
                </section>
              </>
            )}
          </div>
        </AdminLayout>
      ) : null}
    </Layout>
  )
}

// type ServerSideProps = {
//   props: {
//     isAuthenticated: boolean
//   }
// }

// export async function getServerSideProps(
//   context: GetServerSidePropsContext
// ): Promise<ServerSideProps> {
//   return await checkAuth(context)
// }
