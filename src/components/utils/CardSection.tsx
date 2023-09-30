import type { Section, UpdatingSection } from '@/types'
import Image from 'next/image'

type Props = {
  data: Section
  updated?: UpdatingSection
  color?: 'dark' | 'light'
}

export default function SectionCard({
  data,
  updated,
  color
}: Props): JSX.Element {
  const { name, image } = data

  const urlImage = (): string => {
    if (image.includes('blob:http')) return image
    else return `${globalThis.backendUrl}/api/stream/image/${image}`
  }

  const styleFieldUpdated = (
    field: 'name' | 'image'
  ): React.CSSProperties | undefined => {
    if (updated === undefined) return
    const isImageUpdated = field === 'image' && updated[field]
    if (isImageUpdated) return { outline: 'var(--remS) solid var(--turquoise)' }
    else if (updated[field]) return { color: 'var(--turquoise)' }
    return undefined
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
        style={{
          color: color === 'dark' ? 'var(--light)' : undefined,
          ...styleFieldUpdated('name')
        }}
      >
        <span
          className='pa w100p h100p bcDp'
          style={{
            background: color === 'dark' ? 'var(--dark)' : undefined,
            opacity: 0.8
          }}
        />
        <span style={{ zIndex: '100' }}>{name}</span>
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
