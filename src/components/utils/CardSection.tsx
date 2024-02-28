'use client'

import { BACKEND_URL } from '@/app/consts'
import type { Section, UpdatingSection } from '@/types'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

type Props = {
  data: Section
  updated?: UpdatingSection
  color?: 'dark' | 'light'
  link?: boolean
}

export default function SectionCard({
  data,
  updated,
  color,
  link
}: Props): JSX.Element {
  const { name, image } = data
  const router = link === true ? useRouter() : false

  const urlImage = (): string => {
    if (image.includes('blob:http')) return image
    else return `${BACKEND_URL}/api/stream/image/${image}`
  }

  return (
    <article
      className={`relative aspect-video w-full cursor-pointer overflow-hidden rounded-lg transition duration-300 hover:scale-105 ${
        updated !== undefined && updated.image
          ? 'outline outline-turquoise'
          : ''
      }`}
      onClick={() => {
        if (typeof router !== 'boolean')
          router.push(`/productos?section=${name}`)
      }}
    >
      <Image
        className='object-cover'
        alt={name}
        src={urlImage()}
        loader={data => `${urlImage()}?with=${data.width}`}
        fill
      />
      <div
        className={`absolute bottom-0 flex h-1/2 w-full items-center justify-center text-dark-200 dark:text-light-200 ${
          color === 'dark' ? 'bg-dark-200' : ''
        }`}
      >
        <span
          className={`absolute size-full bg-light-200 opacity-80 dark:bg-dark-200 ${
            color === 'dark' ? 'bg-dark-200' : ''
          }`}
        />
        <span
          className={`z-10 text-3xl ${
            updated !== undefined && updated.name ? 'text-turquoise' : ''
          }`}
        >
          {name}
        </span>
      </div>
    </article>
  )
}
