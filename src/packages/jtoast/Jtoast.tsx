'use client'

import { useState, useRef, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import type { Root } from 'react-dom/client'
import Sync from './Sync'
import Async from './Async'
import type { Props } from './types'
import styles from './JToast.module.css'

let jtoastRoot: Root
const toasters: JSX.Element[] = []
const defaultDuration = 3000

export default function JToast(): JSX.Element {
  const toastRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (toastRef.current === null || jtoastRoot !== undefined) return
    jtoastRoot = createRoot(toastRef.current)
  }, [])

  return (
    <div
      ref={toastRef}
      className={`${styles.jtoastPanelCSS} fixed flex flex-col items-center`}
    />
  )
}

function JItem<T>({ children, options, id }: Props<T>): JSX.Element {
  const { duration, asyncUtils } = options ?? {}
  const jtoastRef: React.MutableRefObject<HTMLElement | null> = useRef(null)
  const [active, setActive] = useState(true)

  const isAsync = asyncUtils !== undefined

  const show = (): void => {
    const $item = jtoastRef.current
    if ($item === null) return
    $item.style.animation = `${styles.appear} .3s forwards`
  }

  const remove = (): void => {
    const $item = jtoastRef.current
    if ($item === null) return

    setTimeout(() => {
      $item.style.animation = `${styles.disappear} .3s forwards`
      setTimeout(() => {
        const index = toasters.findIndex(toast => toast.key === id)
        setActive(false)
        toasters.splice(index, 1)
      }, 300)
    }, duration ?? defaultDuration)
  }

  if (!active) return <></>

  return (
    <span
      ref={jtoastRef}
      className={`${styles.jtoastItemCSS} flex items-center gap-2 rounded-lg bg-dark-100 p-4 text-center text-light-100`}
    >
      {isAsync ? (
        <Async show={show} remove={remove} asyncUtils={asyncUtils}>
          {children}
        </Async>
      ) : (
        <Sync show={show} remove={remove}>
          {children}
        </Sync>
      )}
    </span>
  )
}

export function jtoast<T>(msg: string, options?: Props<T>['options']): void {
  const key = crypto.randomUUID()
  const item = (
    <JItem key={key} options={options} id={key}>
      {msg}
    </JItem>
  )

  toasters.push(item)
  jtoastRoot.render(<>{toasters}</>)
}
