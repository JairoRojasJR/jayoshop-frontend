import PropTypes from 'prop-types'
import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import Edit from '@/components/admin/main/Edit'
import Trash from '@/components/admin/main/Trash'
import FieldsProducts from '@/components/admin/utils/FieldsProduct'
import { openModal } from '@/components/global/Modal'
import { updateProduct, deleteProduct } from '@/services/admin/inventory'
import { copyToClipboard } from '@/services/public/utils/copyToClipboard'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro'
import styles from '@/styles/utils/CardProduct.module.css'

export default function CardProduct({
  data,
  action,
  selecteds,
  setSelecteds,
  updated,
  reloadProducts,
  showSection
}) {
  const { name, description, image } = data
  const { price, cuantity, section, barcode } = data

  const [isCardSelected, setIsCardSelected] = useState(false)
  const [maxHeightDescription, setMaxHeightDescription] = useState('0px')
  const descriptionRef = useRef(null)

  const switchSelected = () => {
    const preSelecteds = [...selecteds]
    const finding = selected => selected._id === data._id
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

  const runCard = () => {
    let Component
    if (action === 'multiEliminar') return switchSelected()
    else if (action === 'editar') {
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
    if (selecteds && selecteds.length === 0) setIsCardSelected(false)
  }, [selecteds])

  // Limiting description hight
  useEffect(() => {
    const descriptionHTML = descriptionRef.current
    let lineHeight = window.getComputedStyle(descriptionHTML).lineHeight
    let lineClamp = window.getComputedStyle(descriptionHTML).webkitLineClamp
    lineHeight = parseFloat(lineHeight)
    lineClamp = parseInt(lineClamp)

    const heightToTheSuspensivePoints = lineHeight * lineClamp + lineHeight / 2
    setMaxHeightDescription(heightToTheSuspensivePoints)
  }, [])

  // Html content required
  const cardClassName = () => {
    const className = `${styles.card} bcDs crDp w100p pgM brS dg`
    if (action) return `${className} ${styles.actionActivated} cp`
    return className
  }

  const styleCard = () => {
    const style = { height: '45vw', minHeight: 'var(--ar9)' }
    if (isCardSelected) style.background = 'var(--danger)'
    return style
  }

  const styleFieldUpdated = field => {
    if (!updated) return null
    const isImageUpdated = field === 'image' && updated[field]
    if (isImageUpdated) return { outline: 'var(--remS) solid var(--turquoise)' }
    else if (updated[field]) return { color: 'var(--turquoise)' }
  }

  const urlImage = () => {
    if (data.image.includes('blob:http')) return image
    else return `${globalThis.backendUrl}/api/stream/image/${image}`
  }

  return (
    <article
      className={cardClassName()}
      style={styleCard()}
      onClick={action ? runCard : null}
    >
      <div
        className={`${styles.imgContainer} df jcc pr brS owH`}
        style={styleFieldUpdated('image')}
      >
        {showSection ? (
          <span
            className={`${styles.section} pa tp0 bcDs crDp pgS brS tac toe wsNW owH`}
            style={styleFieldUpdated('section')}
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
            copyToClipboard(barcode)
          }}
          style={styleFieldUpdated('barcode')}
        >
          <FontAwesomeIcon icon={solid('barcode')} />
          <FontAwesomeIcon icon={solid('barcode')} />
        </span>
      </div>
      <div className='df jcfe gpM'>
        <span className='df gpS' style={styleFieldUpdated('cuantity')}>
          <FontAwesomeIcon icon={solid('layer-group')} />
          {`x${cuantity}`}
        </span>
        <span className='df gpS' style={styleFieldUpdated('price')}>
          <FontAwesomeIcon icon={solid('money-bill')} />
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

CardProduct.propTypes = {
  data: PropTypes.object.isRequired,
  action: PropTypes.string,
  selecteds: PropTypes.array,
  setSelecteds: PropTypes.func,
  updated: PropTypes.object,
  reloadProducts: PropTypes.func,
  showSection: PropTypes.bool
}
