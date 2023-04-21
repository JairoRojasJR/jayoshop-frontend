import { useState, useEffect, Fragment } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import Layout from '@/components/global/Layout'
import AdminLayout from '@/components/admin/main/AdminLayout'
import { checkAuth, invoiceProduct } from '@/services/admin/inventory'
import { getProducts } from '@/services/public/inventory'
import { jtoast } from '@/packages/jtoast/Jtoast'

export default function Vender() {
  const [topStickyHeadTable, setTopStickyHeadTable] = useState(0)
  const [productsBilling, setProductsBilling] = useState([])
  const [totalPayable, setTotalPayable] = useState(0)

  const fixTopStickyHeadTable = (newTopSubNav, heightSubNav) => {
    const newTopHeadTable = newTopSubNav + heightSubNav
    setTopStickyHeadTable(newTopHeadTable)
  }

  const addToInvoice = async e => {
    e.preventDefault()
    const form = e.target
    const data = Object.fromEntries(new FormData(form))
    if (!globalThis.isProdMode) form.reset()

    const product = await getProducts({ barcode: data.barcode })

    if (product.length === 0) {
      const notification = `😥No se encontró el producto con el código de barras (${data.barcode})`
      return jtoast(notification)
    } else if (product.cuantity === 0) {
      return jtoast(`Producto (${product.name}) agotado`)
    }

    const alreadyAdded = productsBilling.findIndex(product => {
      return product.data.barcode === parseInt(data.barcode)
    })

    if (alreadyAdded !== -1) {
      const prevProductsBilling = [...productsBilling]
      const product = prevProductsBilling[alreadyAdded]
      const stock = product.data.cuantity
      if (product.cuantity === stock) return jtoast('Producto agotado')

      product.cuantity += 1
      return setProductsBilling(prevProductsBilling)
    }

    const updatedProductsBilling = [
      ...productsBilling,
      { data: product, cuantity: 1 }
    ]

    setProductsBilling(updatedProductsBilling)
  }

  const sendToInvoice = async e => {
    e.preventDefault()
    const productsToInvoice = []
    productsBilling.forEach(product => {
      const { data, cuantity } = product
      productsToInvoice.push({ _id: data._id, cuantity })
    })

    const res = await invoiceProduct(productsToInvoice)
    if (res.error) return jtoast(`Error: ${res.error}`, { duration: 6000 })
    setProductsBilling([])
    jtoast(res.message)
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
      <AdminLayout
        currentSection='vender'
        onChangeSubNavTop={fixTopStickyHeadTable}
      >
        <div
          className='brS df fdc gpLX'
          style={{ border: 'var(--remS) solid var(--darkprimary)' }}
        >
          <form className='df fdc gpM bcDp brS pgM aic' onSubmit={addToInvoice}>
            <label className='cp' htmlFor='barcode'>
              Código de barras
            </label>
            <input
              id='barcode'
              className='pgM brS'
              name='barcode'
              placeholder='Click aquí y escanear'
            />
          </form>
          {productsBilling.length === 0 ? (
            <section className='bcDp df fdc aic gpM pgM'>
              <span>
                👆Haga clic en la entrada anterior y escaneé el código de barras
                de un producto para agregarlo a la facturación
              </span>
              <Image
                className='brS'
                alt='lector de codigo de barras'
                src='/lector-de-codigo-de-barras.jpg'
                width={100}
                height={100}
              />
            </section>
          ) : (
            <table cellSpacing={0} className='bcDp pgM brS'>
              <thead
                className='bcDp psy brS'
                style={{
                  top: `${topStickyHeadTable}px`,
                  transition: 'top var(--timeFlash)',
                  zIndex: 50
                }}
              >
                <tr>
                  <th colSpan={2} />
                  <th className='lineTable'>Precio</th>
                  <th className='lineTable'>Cant.</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {productsBilling.map(product => {
                  const { _id, name, image, price } = product.data
                  const { cuantity } = product
                  const streamProductImage = `${globalThis.streamImage}/${image}`

                  return (
                    <Fragment key={`venderFragment-${_id}`}>
                      <tr style={{ textAlign: 'left' }}>
                        <td colSpan={5}>
                          <div className='bcP h100p df aic gpM pgM brS'>
                            <span className='productImageContainer pr'>
                              <Image
                                className='brS owH ofCr'
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
                            </span>
                            <span>{name}</span>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td colSpan={2} style={{ width: '30%' }} />
                        <td className='lineTable'>{price}$</td>
                        <td className='lineTable'>
                          x{cuantity} / {product.data.cuantity}
                        </td>
                        <td>{(price * cuantity).toFixed(2)}$</td>
                      </tr>
                    </Fragment>
                  )
                })}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={5} style={{ paddingTop: 'var(--remM)' }}>
                    <div className='bcP pgM df aic jcfe'>
                      <span
                        className='pgM brS'
                        style={{
                          border: 'var(--remS) solid var(--darkprimary)'
                        }}
                      >
                        Total a pagar
                      </span>
                      <span className='bcDp pgM brS'>
                        {totalPayable.toFixed(2)}$
                      </span>
                    </div>
                  </td>
                </tr>
              </tfoot>
            </table>
          )}
          <section className='bcDp brS pgM tac'>
            <button
              className='bcTurq brS crDp cp'
              style={{ padding: 'var(--remM) var(--remL)' }}
              onClick={sendToInvoice}
            >
              Facturar
            </button>
          </section>
        </div>
        <style jsx>{`
          input:focus {
            box-shadow: -0.1rem -0.1rem 0.3rem var(--sky-blue),
              0.1rem 0.1rem 0.3rem var(--sky-blue);
          }

          th {
            padding: var(--remM) var(--remS);
          }

          td {
            padding: 0 var(--remS);
          }

          .lineTable {
            border-right: var(--remS) solid var(--primary);
          }

          th,
          tr {
            text-align: right;
          }

          .productImageContainer {
            minwidth: calc(var(--ar16) / 3);
            width: calc(var(--ar16) / 3);
            height: calc(var(--ar9) / 3);
          }
        `}</style>
      </AdminLayout>
    </Layout>
  )
}

export async function getServerSideProps(context) {
  return checkAuth(context)
}
