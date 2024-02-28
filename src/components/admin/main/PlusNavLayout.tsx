'use client'

import { useEffect, useRef, useState } from 'react'
import { runTransition } from '@/services/public/utils/transition'
import { nanoid } from 'nanoid'
import { setTimeout } from 'timers'
import CubePlus from '@/svg/Cube-plus'
import SquareMinus from '@/svg/Square-minus'
import type {
  AdminLogistics,
  AdminLogisticsObject,
  Transition,
  TransitionProperties
} from '@/types'

type Props = {
  children: React.ReactNode
  options: AdminLogisticsObject[]
  plusInAction: AdminLogistics
  setPlusInAction: React.Dispatch<AdminLogistics | ''>
}

export default function PlusNavLayout({
  children,
  options,
  plusInAction,
  setPlusInAction
}: Props): JSX.Element {
  const [status, setStatus] = useState('close')

  type InitialWidth = Array<
    AdminLogisticsObject & { initialWidth: `${number}px` }
  >
  const [optionsMinWidth, setOptionsMinWidth] = useState<InitialWidth>([
    { name: 'Nuevo producto', initialWidth: '0px' },
    { name: 'Secciones', initialWidth: '0px' }
  ])

  type RefButton = React.MutableRefObject<HTMLButtonElement | null>
  type Ref = React.MutableRefObject<HTMLElement | null>
  const buttonsContainerRef: RefButton = useRef(null)
  const optionInActionRef: Ref = useRef(null)

  const resizingPlusOption = (option: AdminLogistics): void => {
    setPlusInAction(option)

    const optionInActionHTML = optionInActionRef.current

    if (optionInActionHTML === null) {
      throw new Error('No se encontró el elemento referenciado')
    }

    setTimeout(() => {
      const currentHeight = `${optionInActionHTML.clientHeight}px`
      const currentHeightOfContent = `${optionInActionHTML.children[0].scrollHeight}px`
      const transitions: Transition[] = [
        {
          element: optionInActionHTML,
          properties: {
            from: { height: currentHeightOfContent },
            to: { height: currentHeight }
          }
        }
      ]
      runTransition(transitions, 0).catch((e: Error) => {
        console.log(e.message)
      })
    }, 1)
  }

  const switchPlusOption = (option: AdminLogistics): void => {
    const $optionInAction = optionInActionRef.current
    if ($optionInAction === null) {
      throw new Error('No se encontró el elemento referenciado')
    }
    const isResizing = status === 'open' && option !== plusInAction
    if (isResizing) {
      resizingPlusOption(option)
      return
    }

    const closing = status === 'open'
    const toggle = closing ? 0 : 1
    const newStatus = closing ? 'close' : 'open'
    const newPlusInAction = closing ? '' : option

    const runSwitch = (): void => {
      setPlusInAction(newPlusInAction)
      setStatus(newStatus)
    }

    const getProperties = (): TransitionProperties => ({
      from: { height: '0px' },
      to: {
        height: `${$optionInAction.scrollHeight}px`
      }
    })

    const transitions: Transition[] = [
      {
        element: $optionInAction,
        display: runSwitch,
        properties: getProperties
      }
    ]

    runTransition(transitions, toggle)
      .then(() => {
        if (toggle === 1) $optionInAction.style.overflowY = 'auto'
        else $optionInAction.style.overflowY = 'hidden'
      })
      .catch((e: Error) => {
        console.log(e.message)
      })
  }

  useEffect(() => {
    const buttonsContainerHTML = buttonsContainerRef.current
    const buttonsHTML = buttonsContainerHTML?.children
    const preOptionsMinWidth: InitialWidth = [...optionsMinWidth]

    if (buttonsHTML === undefined) return

    for (const button in buttonsHTML) {
      const $button = buttonsHTML[button]

      const option = $button.getAttribute('data-option') as AdminLogistics
      const width = $button.clientWidth

      preOptionsMinWidth.find((buttonData, index) => {
        if (buttonData.name === option) {
          preOptionsMinWidth[index].initialWidth = `${width}px`
        }
        return buttonData.name === option
      })

      if (parseInt(button) === buttonsHTML.length - 1) break
    }

    setOptionsMinWidth(preOptionsMinWidth)
  }, [])

  // Components required
  type OptionProps = { name: AdminLogistics }

  function Option({ name }: OptionProps): JSX.Element {
    const className = (): string => {
      const className =
        'p-2 rounded-md flex justify-center gap-2 cursor-pointer text-dark-100 hover:bg-skyviolet transition duration-300'
      if (plusInAction === name) return `${className} bg-skyviolet`
      return `${className} bg-skyblue`
    }

    const index = optionsMinWidth.findIndex(option => option.name === name)

    let minWidth = '0px'
    if (index !== -1) minWidth = optionsMinWidth[index].initialWidth
    else throw new Error(`No se encontró la opción ${name}`)

    return (
      <button
        className={className()}
        style={{ minWidth }}
        onClick={() => {
          switchPlusOption(name)
        }}
        data-option={name}
      >
        {plusInAction !== name ? <CubePlus /> : <SquareMinus />}
        {status === 'open' && name === plusInAction ? 'Ocultar' : name}
      </button>
    )
  }

  return (
    <article className='flex w-full flex-col gap-4 border-t-4 border-dark-300 p-2'>
      <header ref={buttonsContainerRef} className='flex gap-2 overflow-auto'>
        {options.map(option => (
          <Option key={nanoid(5)} name={option.name} />
        ))}
      </header>
      <main
        ref={optionInActionRef}
        className='invisible h-0 max-h-[60vh] flex-col transition-all duration-300'
        style={{ scrollbarWidth: 'thin' }}
      >
        {children}
      </main>
    </article>
  )
}
