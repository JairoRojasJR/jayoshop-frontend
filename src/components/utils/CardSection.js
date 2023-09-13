import PropTypes from 'prop-types'
import Image from 'next/image'

export default function SectionCard({ data, updated }) {
  const { name, image } = data

  const urlImage = () => {
    if (image.includes('blob:http')) return image
    else return `${globalThis.backendUrl}/api/stream/image/${image}`
  }

  const styleFieldUpdated = field => {
    if (!updated) return null
    const isImageUpdated = field === 'image' && updated[field]
    if (isImageUpdated) return { outline: 'var(--remS) solid var(--turquoise)' }
    else if (updated[field]) return { color: 'var(--turquoise)' }
  }

  return (
    <article className='pr brL owH cp' style={styleFieldUpdated('image')}>
      <Image
        className='ofCr'
        alt={name}
        src={urlImage()}
        loader={data => `${urlImage()}?with=${data.width}`}
        fill
      />
      <div
        className='pa w100p df fFC crDs bm0'
        style={styleFieldUpdated('name')}
      >
        <span className='pa w100p h100p bcDp' style={{ opacity: 0.8 }} />
        <span style={{ opacity: 0.8 }}>{name}</span>
      </div>
      <style jsx>{`
        article {
          height: calc(100vw - (var(--ar9) * 1.5));
          min-height: calc(var(--ar9) * 1.3);
        }

        div {
          height: 50%;
          font-size: var(--remLX);
        }
      `}</style>
    </article>
  )
}

SectionCard.propTypes = {
  data: PropTypes.object.isRequired,
  updated: PropTypes.object
}
