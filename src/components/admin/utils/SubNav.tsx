import { useRef } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { nanoid } from 'nanoid'
import type { Sections } from '@/types'

type Props = {
  sections: Sections
  pathBrowsing: string
}

export default function SubNav({ sections, pathBrowsing }: Props): JSX.Element {
  const router = useRouter()
  const outputSections = [{ name: 'Todo' }, ...sections]
  const linksContainerRef: React.MutableRefObject<HTMLUListElement | null> =
    useRef(null)

  return (
    <nav className='m-auto flex max-w-[500px] justify-center self-center rounded-b-md border-4 border-t-0 border-solid border-dark-300 bg-light-100 dark:bg-dark-100'>
      <ul
        ref={linksContainerRef}
        className='flex gap-2 overflow-auto p-1'
        style={{ scrollbarWidth: 'thin' }}
      >
        {outputSections.map(section => {
          const { name } = section
          let href = pathBrowsing
          if (name !== 'Todo') href += `?section=${section.name}`

          let className = 'list-none p-2 rounded-md'
          const isTheMainPage = Object.entries(router.query).length === 0
          const match = name === router.query?.section
          const matchWithSectionTodo = isTheMainPage && name === 'Todo'
          const isCurrentSection = match || matchWithSectionTodo

          if (isCurrentSection) className += ' bg-turquoise text-dark-100'
          else className += ' bg-light-200 dark:bg-dark-200'

          return (
            <li key={nanoid(10)} className='flex'>
              <Link href={href} className={className}>
                {name}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
