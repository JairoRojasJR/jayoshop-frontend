import PropTypes from 'prop-types'
import { useRef, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { nanoid } from 'nanoid'

export default function SubNav({ sections, pathBrowsing }) {
  const router = useRouter()
  const outputSections = [{ name: 'Todo' }, ...sections]
  const linksContainerRef = useRef(null)

  useEffect(() => {
    const linksContainerHTML = linksContainerRef.current
    const clientWidth = linksContainerHTML.clientWidth
    const scrollWidth = linksContainerHTML.scrollWidth
    const overflow = scrollWidth > clientWidth

    if (overflow) linksContainerHTML.style.justifyContent = 'flex-start'
    else linksContainerHTML.style.justifyContent = 'space-evenly'
  }, [sections])

  return (
    <nav className='bcP'>
      <ul ref={linksContainerRef} className='w100p df jcse gpS pgS owA'>
        {outputSections.map(section => {
          const { name } = section
          let href = pathBrowsing
          if (name !== 'Todo') href += `?section=${section.name}`

          let className = 'bcDp lsn pgM brS'
          const isTheMainPage = Object.entries(router.query).length === 0
          const match = name === router.query?.section
          const matchWithSectionTodo = isTheMainPage && name === 'Todo'
          const isCurrentSection = match || matchWithSectionTodo

          if (isCurrentSection) className += ' bcTurq crD'

          return (
            <li key={nanoid(10)} className='df'>
              <Link href={href} className={className}>
                {name}
              </Link>
            </li>
          )
        })}
      </ul>
      <style jsx>{`
        nav {
          border: var(--remS) solid var(--darksecondary);
          border-top: none;
          border-bottom-left-radius: var(--remS);
          border-bottom-right-radius: var(--remS);
        }
      `}</style>
    </nav>
  )
}

SubNav.propTypes = {
  sections: PropTypes.array.isRequired,
  pathBrowsing: PropTypes.string.isRequired
}
