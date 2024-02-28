'use client'
import { type MutableRefObject, useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import type { Root } from 'react-dom/client'
import styles from '@/packages/jtoast/JToast.module.css'
import { DotWave } from '@uiball/loaders'
import CircleCheck from '@/svg/Circle-check'
import CircleX from '@/svg/Circle-x'
import type { ErrorHandle } from '@/types'

type options = {
  duration?: number
  onAsyncEvents?: {
    isAsync: boolean
    callback: () => Promise<void>
    onSuccess: string
    handleError?: (e: ErrorHandle) => string
  }
  clean?: boolean
}

type JtoastItemProps = {
  children: string
  options?: options
  id: string
}

const defaultOption: options = {
  duration: 3000
}

let jtoastRoot: Root
let counterToaster = 0
const toasters: JSX.Element[] = []

export default function JToast(): JSX.Element {
  let finished = false
  useEffect(() => {
    if (!finished) {
      const jtoastHTML = document.getElementById('JToast') as HTMLElement
      jtoastRoot = createRoot(jtoastHTML)
      finished = true
    }
  }, [])

  return (
    <div
      id='JToast'
      className={`${styles.jtoastPanelCSS} gpL fixed flex flex-col items-center`}
    />
  )
}

function JtoastItem({
  children,
  options = defaultOption,
  id
}: JtoastItemProps): JSX.Element {
  const [active, setActive] = useState(true)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string>('')
  const jtoastItemRef: MutableRefObject<HTMLElement | null> = useRef(null)
  const { duration, onAsyncEvents } = options
  const isAsync = onAsyncEvents?.isAsync ?? false

  useEffect(() => {
    if (options?.clean === true) toasters.length = 0
    if (isAsync) setPending(true)

    const jtoastItemHTML = jtoastItemRef.current
    if (jtoastItemHTML !== null) {
      jtoastItemHTML.style.animation = `${styles.appear} .3s forwards`

      const runDisappear = (): void => {
        setTimeout(() => {
          jtoastItemHTML.style.animation = `${styles.disappear} .3s forwards`
          setTimeout(() => {
            const index = toasters.findIndex(toast => toast.key === id)
            setActive(false)
            toasters.splice(index, 1)
          }, 300)
        }, duration ?? defaultOption.duration)
      }

      if (onAsyncEvents?.isAsync === true) {
        const { callback, handleError } = onAsyncEvents
        const noCallback = callback === undefined

        if (noCallback) throw new Error('Falta la función asincrona a resolver')

        const runCallback = async (): Promise<void> => {
          try {
            await callback()
            setPending(false)
            runDisappear()
          } catch (e) {
            const error = e as ErrorHandle

            let errorMsg
            if (handleError !== undefined) errorMsg = handleError(error)
            else errorMsg = error.message

            setPending(false)
            setError(errorMsg)
            runDisappear()
          }
        }

        runCallback().catch((e: Error) => {
          console.log(e.message)
        })
      } else runDisappear()
    }
  }, [])

  return (
    <>
      {active ? (
        <span
          ref={jtoastItemRef}
          className={`${styles.jtoastItemCSS} flex items-center gap-2 rounded-lg bg-dark-100 p-4 text-center text-light-100`}
        >
          {onAsyncEvents?.isAsync === true && pending ? (
            <DotWave size={30} speed={1} color='white' />
          ) : null}
          {!pending &&
          error.length === 0 &&
          onAsyncEvents?.onSuccess !== undefined ? (
            <>
              <CircleCheck stroke='#0f0' />
              {onAsyncEvents?.onSuccess}
            </>
          ) : null}
          {!pending && error.length > 0 ? (
            <>
              <CircleX stroke='#f00' />
              {error}
            </>
          ) : null}
          {pending || !isAsync ? children : null}
        </span>
      ) : null}
    </>
  )
}

function JtoastContainer(): JSX.Element {
  return <>{toasters.map(toaster => toaster)}</>
}

export const jtoast = (msg: string, options?: options): void => {
  counterToaster++
  const key = `toast-${counterToaster}`

  toasters.push(
    <JtoastItem key={key} options={options} id={key}>
      {msg}
    </JtoastItem>
  )

  jtoastRoot.render(<JtoastContainer />)
}
