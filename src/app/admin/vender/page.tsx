'use client'

import { useState, Fragment } from 'react'
import Image from 'next/image'
import { jtoast } from '@/packages/jtoast/Jtoast'
import { toastError } from '@/lib/server'
import { getProduct, invoiceProduct } from '@/services/inventory'
import { STREAM_IMAGE } from '@/app/consts'
import type { MouseEvent } from '@/types/local'
import type { Product } from '@/types/server'
import style from '@/css/Sell.module.css'

type Billing = { product: Product; onInvoice: number }

export default function Vender(): JSX.Element {
  const [billing, setBilling] = useState<Billing[]>([])

  const addToInvoice = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const barcode = parseInt(Object.fromEntries(formData).barcode as string)
    const find = billing.findIndex(({ product }) => product.barcode === barcode)

    try {
      if (find === -1) {
        const product = await getProduct({ barcode })
        if (product.cuantity === 0) return jtoast('Producto agotado')

        const added = [...billing, { product, onInvoice: 1 }]
        return setBilling(added)
      }

      const incremented = billing.map(({ product, onInvoice }) => {
        if (barcode !== product.barcode) return { product, onInvoice }
        if (onInvoice >= product.cuantity) {
          throw new Error('😧Ha superado la cantidad en stock')
        }
        return { product, onInvoice: onInvoice + 1 }
      })

      return setBilling(incremented)
    } catch (error) {
      toastError(error)
    }
  }

  const sendToInvoice = async (
    e: MouseEvent<HTMLButtonElement>
  ): Promise<void> => {
    e.preventDefault()
    const invoice = billing.map(({ product, onInvoice }) => {
      return { _id: product._id, cuantity: onInvoice }
    })

    try {
      const res = await invoiceProduct(invoice)
      jtoast(res.message)
      setBilling([])
    } catch (error) {
      toastError(error)
    }
  }

  return (
    <div className={style.shell__container}>
      <form className={style.shell__form} onSubmit={addToInvoice}>
        <label style={{ cursor: 'pointer' }} htmlFor='barcode'>
          Código de barras
        </label>
        <input
          id='barcode'
          name='barcode'
          placeholder='Click aquí y escanear'
          type='number'
        />
      </form>
      <section
        className={`${style.shell__instructions} ${billing.length > 0 ? style.hidde : ''}`.trim()}
      >
        <span>
          👆Haga clic en la entrada anterior y escaneé el código de barras de un
          producto para agregarlo a la facturación
        </span>
        <Image
          alt='lector de codigo de barras'
          src='/lector-de-codigo-de-barras.jpg'
          width={100}
          height={100}
        />
      </section>
      <table
        className={`${style.shell__table} ${billing.length === 0 ? style.hidde : ''}`.trim()}
        cellSpacing={0}
      >
        <thead>
          <tr>
            <th colSpan={2} />
            <th>Precio</th>
            <th>Cant.</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {billing.map(current => {
            const { _id, name, image, price } = current.product
            const { onInvoice } = current
            const streamProductImage = `${STREAM_IMAGE}/${image}`

            return (
              <Fragment key={`venderFragment-${_id}`}>
                <tr className={style.shell__table__item__hero}>
                  <td>
                    <Image
                      alt={name}
                      src={streamProductImage}
                      width={150}
                      height={150}
                      sizes='(max-width: 768px) 100vw,(max-width: 1200px) 50vw,33vw'
                    />
                  </td>
                  <td colSpan={4}>
                    <span>{name}</span>
                  </td>
                </tr>
                <tr className={style.shell__table__item__data}>
                  <td colSpan={2} style={{ width: '30%' }} />
                  <td className={style['shell__table__item__hero-td']}>
                    {price}$
                  </td>
                  <td className={style['shell__table__item__hero-td']}>
                    x{onInvoice} / {current.product.cuantity}
                  </td>
                  <td>{(price * onInvoice).toFixed(2)}$</td>
                </tr>
              </Fragment>
            )
          })}
        </tbody>
        <tfoot className={style.shell__table__foot}>
          <tr>
            <td colSpan={5}>
              <div className={style.shell__total__container}>
                <div className={style.shell__total__subcontainer}>
                  <span>Total a pagar:</span>
                  <span>
                    {billing
                      .reduce((a, b) => a + b.product.price * b.onInvoice, 0)
                      .toFixed(2)}
                    $
                  </span>
                </div>
              </div>
            </td>
          </tr>
        </tfoot>
      </table>
      <section className={style.shell__invoice}>
        <button type='submit' onClick={sendToInvoice}>
          Facturar
        </button>
      </section>
    </div>
  )
}
