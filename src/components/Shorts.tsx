'use client'
import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { useProductsContext } from '@/context/Products'
import { useViewInsertContext } from '@/context/ViewInsert'
import type { Section } from '@/types/server'
import style from '@/css/ShortStyles.module.css'
import productsStyle from '@/css/Products.module.css'

// ========================= Awaiting =========================
type AwaitingProps = { awaiting: boolean }

export function Awaiting({ awaiting }: AwaitingProps): JSX.Element {
  return (
    <div
      className={`backdrop ${style.awaiting} ${awaiting ? style['awaiting-show'] : ''}`.trim()}
    />
  )
}

// ========================= Switcher =========================
export function Switcher(): JSX.Element {
  const { currentSection } = useProductsContext()
  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    const input = inputRef.current as unknown as HTMLInputElement
    input.checked = false
  }, [currentSection])

  return <input id='switcher' ref={inputRef} type='checkbox' />
}

// ========================= ConfirmDel =========================
type ConfirmDelProps = {
  target: string
  separator?: boolean
  trash: () => void
}

export function ConfirmDel({
  target,
  separator = false,
  trash
}: ConfirmDelProps): JSX.Element {
  const { closing } = useViewInsertContext()

  return (
    <section
      className={`${style.confirm__del} ${separator ? style.separated : ''}`}
    >
      <p>
        Seguro que desea eliminar {target} del inventario, esta acción es
        irreversible.
      </p>
      <button className={style.confirm__del__cancel} onClick={closing}>
        Cancelar
      </button>
      <button className={style.confirm__del__send} onClick={trash}>
        Si, eliminar
      </button>
    </section>
  )
}

// ========================= SectionsNav =========================
type Props = {
  path: string
  sections: Section[]
  currentSection: string | string[] | undefined
}

export function SectionsNav({
  path,
  sections,
  currentSection
}: Props): JSX.Element {
  return (
    <nav className={productsStyle.nav__sections}>
      <label htmlFor='switcher' className='nav__sections__switch'>
        <span className='nav__sections__title'>Sección</span>
        <h2 className='nav__sections__section'>{currentSection ?? 'Todo'}</h2>
      </label>
      <Switcher />
      <ul className='nav__sections__content'>
        <li>
          <Link className='nav__sections__link' href={path} scroll={false}>
            Todo
          </Link>
        </li>
        {sections.map(({ name }) => (
          <li key={crypto.randomUUID()}>
            <Link
              className='nav__sections__link'
              href={`${path}?section=${name}`}
              scroll={false}
            >
              {name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
