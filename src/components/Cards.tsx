'use client'

import Image from 'next/image'
import { useProductsContext } from '@/context/Products'
import { useSectionsContext } from '@/context/Sections'
import BarCode from '@/svg/BarCode'
import BoxMultiple from '@/svg/BoxMultiple'
import CashBanknote from '@/svg/CashBanknote'
import { $$updateable } from '@/lib/local'
import { STREAM_IMAGE } from '@/app/consts'
import type { Product, Section } from '@/types/server'
import inventoryStyle from '@/css/Inventory.module.css'
import productCardStyle from '@/css/ProductCard.module.css'
import sectionCardStyle from '@/css/SectionCard.module.css'

type ProductCardProps = {
  children?: React.ReactNode
  data: Product
  administrable?: boolean
  compare?: Product
  separator?: boolean
  selectable?: boolean
}

export function ProductCard({
  children,
  data,
  administrable = false,
  compare,
  separator = false,
  selectable = false
}: ProductCardProps): JSX.Element {
  const { multiSelect, selectProduct, selecteds, currentSection } =
    useProductsContext() ?? {}
  const { _id, name, image, description, cuantity, price, section } = data

  return (
    <article
      className={`${productCardStyle.product} ${separator ? inventoryStyle.card__separated : ''} ${selectable && multiSelect ? inventoryStyle.selectable : ''} ${selectable && selecteds.includes(_id) ? inventoryStyle.selected : ''}`.trim()}
      onClick={multiSelect ? () => selectProduct(_id) : undefined}
    >
      <div className='product__img__container'>
        {currentSection === undefined && (
          <span className={$$updateable('truncate', 'section', data, compare)}>
            {section}
          </span>
        )}
        <Image
          className={$$updateable('', 'image', data, compare)}
          alt={name}
          src={image.includes('blob:http') ? image : `${STREAM_IMAGE}/${image}`}
          width={200}
          height={200}
          // loader={data => `${imgUrl}?width=${data.width}`}
          sizes='(max-width: 768px) 100vw,(max-width: 1200px) 50vw,33vw'
        />
      </div>
      <h2 className={$$updateable('truncate', 'name', data, compare)}>
        {name}
      </h2>
      <span
        className={$$updateable(
          'product__description',
          'description',
          data,
          compare
        )}
      >
        {description}
      </span>
      <span className='product__barcode'>
        <BarCode
          className={$$updateable('product__barcode', 'barcode', data, compare)}
        />
      </span>
      <div className='product__trade__info'>
        <span
          className={$$updateable(
            'product__trade__info__item',
            'cuantity',
            data,
            compare
          )}
        >
          <BoxMultiple />
          {`x${cuantity}`}
        </span>
        <span
          className={$$updateable(
            'product__trade__info__item',
            'price',
            data,
            compare
          )}
        >
          <CashBanknote />
          {`${price}$`}
        </span>
      </div>
      {administrable && children}
    </article>
  )
}

type SectionCardProps = {
  children?: React.ReactNode
  data: Section
  administrable?: boolean
  compare?: Section
  separator?: boolean
  selectable?: boolean
  simple?: boolean
}

export function SectionCard({
  children,
  data,
  administrable = false,
  compare,
  separator = false,
  selectable = false,
  simple = false
}: SectionCardProps): JSX.Element {
  const { multiSelect, selectSection, selecteds } = useSectionsContext() ?? {}
  const { _id, name, image } = data

  return (
    <article
      className={`${sectionCardStyle.section__card} ${selectable && multiSelect ? inventoryStyle.selectable : ''} ${separator ? inventoryStyle.card__separated : ''} ${simple ? sectionCardStyle['section__card-simple'] : ''}`.trim()}
      onClick={multiSelect ? () => selectSection(_id) : undefined}
    >
      <div
        className={`${sectionCardStyle.section__card__content} ${selectable && selecteds.includes(_id) ? inventoryStyle.selected : ''}`.trim()}
      >
        <Image
          className={$$updateable('', 'image', data, compare)}
          alt={name}
          src={image.includes('blob:http') ? image : `${STREAM_IMAGE}/${image}`}
          width={300}
          height={168.5}
          sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
        />
        <span
          className={$$updateable(
            sectionCardStyle.section__name,
            'name',
            data,
            compare
          )}
        >
          {name}
        </span>
      </div>
      {administrable && children}
    </article>
  )
}
