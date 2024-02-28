import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import Edit from '@/components/admin/main/Edit'
import Trash from '@/components/admin/main/Trash'
import FieldsProducts from '@/components/admin/utils/FieldsProduct'
import { openModal } from '@/components/global/Modal'
import { updateProduct, deleteProduct } from '@/services/admin/inventory'
import { copyToClipboard } from '@/services/public/utils/copyToClipboard'
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

  // Html content required
  const cardClassName = (): string => {
    const className = `grid-cols-[35%_1fr] grid-rows-[30%_50%_20%] w-full p-2 rounded-md grid aspect-[8/5]`
    if (action !== '') return `${className} hover:contrast-150 cursor-pointer`
    return className
  }

  const styleCard = (): React.CSSProperties => {
    const style: React.CSSProperties = {}
    if (isCardSelected) style.background = 'var(--danger)'
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

  console.log(color)

  return (
    <article
      className={`${cardClassName()} ${
        color === 'dark'
          ? 'bg-dark-100 text-light-200'
          : 'bg-dark-200 text-light-200 dark:bg-light-200 dark:text-dark-200'
      }`}
      style={styleCard()}
      onClick={action !== undefined ? runCard : undefined}
    >
      <div
        className='relative row-span-2 flex justify-center overflow-hidden rounded-md p-2'
        style={styleFieldUpdated('image')}
      >
        {showSection !== undefined ? (
          <span
            className='absolute top-0 z-50 w-[85%] truncate rounded-b-md bg-dark-200 p-1 text-center text-light-200 dark:bg-light-200 dark:text-dark-200'
            style={{
              ...styleFieldUpdated('section')
            }}
          >
            {section}
          </span>
        ) : null}
        <Image
          className='object-cover'
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
      <div className='overflow-hidden p-2'>
        <h3
          className='w-full truncate border-b-4 border-light-100 dark:border-dark-100'
          style={styleFieldUpdated('name')}
        >
          {name}
        </h3>
      </div>
      <div className='p-2' style={styleFieldUpdated('description')}>
        <span ref={descriptionRef} className='line-clamp-3'>
          {description}
        </span>
      </div>
      <div className='flex items-center justify-center p-2'>
        <span
          className='cursor-pointer'
          onClick={e => {
            e.stopPropagation()
            copyToClipboard(barcode.toString()).catch(() => {})
          }}
          style={styleFieldUpdated('barcode')}
        >
          <BarCode />
        </span>
      </div>
      <div className='flex justify-end gap-2 p-2'>
        <span className='flex gap-1' style={styleFieldUpdated('cuantity')}>
          <BoxMultiple />
          {`x${cuantity}`}
        </span>
        <span className='flex gap-1' style={styleFieldUpdated('price')}>
          <CashBanknote />
          {`${price}$`}
        </span>
      </div>
    </article>
  )
}
