import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import Edit from '@/components/admin/main/Edit'
import Trash from '@/components/admin/main/Trash'
import FieldsProducts from '@/components/admin/utils/FieldsProduct'
import { openModal } from '@/components/global/Modal'
import { updateProduct, deleteProduct } from '@/services/admin/inventory'
import { copyToClipboard } from '@/services/public/utils/copyToClipboard'
import styles from '@/styles/utils/CardProduct.module.css'
import type {
  AdminAction,
  Product,
  Products,
  OnSuccesServer,
  UpdatingProduct
} from '@/types'
import BarCode from '@/svg/Bar-code'
import BoxMultiple from '@/svg/Box-multiple'
import CashBanknote from '@/svg/Cash-banknote'

type Props = {
  data: Product
  action?: AdminAction
  selecteds?: Product[]
  setSelecteds?: (product: Products) => void
  updated?: UpdatingProduct
  reloadProducts?: OnSuccesServer
  showSection?: boolean
  color?: 'dark' | 'light'
}

export default function CardProduct({
  data,
  action,
  selecteds,
  setSelecteds,
  updated,
  reloadProducts,
  showSection,
  color
}: Props): JSX.Element {
  const { name, description, image } = data
  const { price, cuantity, section, barcode } = data

  const [isCardSelected, setIsCardSelected] = useState(false)
  const [maxHeightDescription, setMaxHeightDescription] = useState(0)

  type DescriptionRef = React.MutableRefObject<HTMLSpanElement | null>
  const descriptionRef: DescriptionRef = useRef(null)

  const switchSelected = (): void => {
    if (selecteds === undefined || setSelecteds === undefined) {
      throw new Error('Falta la propiedad selecteds o setSelecteds')
    }

    const preSelecteds = [...selecteds]
    const finding = (selected: Product): boolean => selected._id === data._id
    const index = preSelecteds.findIndex(finding)

    if (index === -1) {
      preSelecteds.push(data)
      setIsCardSelected(true)
    } else {
      preSelecteds.splice(index, 1)
      setIsCardSelected(false)
    }

    setSelecteds(preSelecteds)
  }

  const runCard = (): void => {
    const noReloadProducts = reloadProducts === undefined

    if (noReloadProducts) {
      throw new Error('Falta la función al recargar productos')
    }

    let Component
    if (action === 'multieliminar') {
      switchSelected()
      return
    } else if (action === 'editar') {
      Component = (
        <Edit
          Card={CardProduct}
          data={data}
          Fields={FieldsProducts}
          send={updateProduct}
          onSuccess={reloadProducts}
        />
      )
    } else if (action === 'eliminar') {
      Component = (
        <Trash
          Card={CardProduct}
          data={data}
          wish='eliminar este producto'
          send={deleteProduct}
          onSuccess={reloadProducts}
        />
      )
    } else return

    openModal({ Component })
  }

  useEffect(() => {
    if (selecteds !== undefined && selecteds.length === 0) {
      setIsCardSelected(false)
    }
  }, [selecteds])

  // Limiting description hight
  useEffect(() => {
    const descriptionHTML = descriptionRef.current
    if (descriptionHTML === null) return
    const cumputedStyle = window.getComputedStyle(descriptionHTML)
    const lineHeight = parseFloat(cumputedStyle.lineHeight)
    const lineClamp = parseInt(cumputedStyle.webkitLineClamp)

    const heightToTheSuspensivePoints = lineHeight * lineClamp + lineHeight / 2
    setMaxHeightDescription(heightToTheSuspensivePoints)
  }, [])

  // Html content required
  const cardClassName = (): string => {
    const className = `${styles.card} bcDs crDp w100p pgM brS dg`
    if (action !== '') return `${className} ${styles.actionActivated} cp`
    return className
  }

  const styleCard = (): React.CSSProperties => {
    const style: React.CSSProperties = {
      height: '45vw',
      minHeight: 'var(--ar9)'
    }
    if (isCardSelected) style.background = 'var(--danger)'
    if (color === 'dark') {
      style.background = 'var(--dark)'
      style.color = 'var(--light)'
    }
    return style
  }

  const styleFieldUpdated = (
    field: keyof UpdatingProduct
  ): React.CSSProperties | undefined => {
    if (updated === undefined) return
    const isImageUpdated = field === 'image' && updated[field]
    if (isImageUpdated) return { outline: 'var(--remS) solid var(--turquoise)' }
    else if (updated[field]) return { color: 'var(--turquoise)' }
  }

  const urlImage = (): string => {
    if (data.image.includes('blob:http')) return image
    else return `${globalThis.backendUrl}/api/stream/image/${image}`
  }

  return (
    <article
      className={cardClassName()}
      style={styleCard()}
      onClick={action !== undefined ? runCard : undefined}
    >
      <div
        className={`${styles.imgContainer} df jcc pr brS owH`}
        style={styleFieldUpdated('image')}
      >
        {showSection !== undefined ? (
          <span
            className={`${styles.section} pa tp0 bcDs crDp pgS brS tac toe wsNW owH`}
            style={{
              background: color === 'dark' ? 'var(--dark)' : undefined,
              color: color === 'dark' ? 'var(--light)' : undefined,
              ...styleFieldUpdated('section')
            }}
          >
            {section}
          </span>
        ) : null}
        <Image
          className='ofCr'
          alt={name}
          src={urlImage()}
          loader={data => `${urlImage()}?width=${data.width}`}
          fill
          style={styleFieldUpdated('image')}
          sizes={`
            (max-width: 768px) 100vw,
            (max-width: 1200px) 50vw,
            33vw
          `}
        />
      </div>
      <div className='owH'>
        <h3
          className={`${styles.title} w100p toe wsNW owH`}
          style={styleFieldUpdated('name')}
        >
          {name}
        </h3>
      </div>
      <div className='pgS' style={styleFieldUpdated('description')}>
        <span ref={descriptionRef} className='description'>
          {description}
        </span>
      </div>
      <div className='df aic jcc'>
        <span
          className='cp'
          onClick={e => {
            e.stopPropagation()
            copyToClipboard(barcode.toString()).catch(() => {})
          }}
          style={styleFieldUpdated('barcode')}
        >
          <BarCode />
        </span>
      </div>
      <div className='df jcfe gpM'>
        <span className='df gpS' style={styleFieldUpdated('cuantity')}>
          <BoxMultiple />
          {`x${cuantity}`}
        </span>
        <span className='df gpS' style={styleFieldUpdated('price')}>
          <CashBanknote />
          {`${price}$`}
        </span>
      </div>
      <style jsx>{`
        div {
          padding: var(--remM);
        }

        .description {
          display: -webkit-box;
          overflow: hidden;
          max-height: ${maxHeightDescription};
          text-overflow: ellipsis;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 3;
        }
      `}</style>
    </article>
  )
}
