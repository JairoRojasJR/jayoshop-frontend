import React, { useEffect, useState } from 'react'
import { DotWaveLoader } from '@/components/DotWaveLoader'
import CircleCheck from '@/svg/CircleCheck'
import CircleX from '@/svg/CircleX'
import type { ItemsContentProps, Props as JtoastProps } from './types'

type Props<T> = ItemsContentProps & {
  asyncUtils: NonNullable<NonNullable<JtoastProps<T>['options']>['asyncUtils']>
}

export default function Async<T>({
  children,
  show,
  remove,
  asyncUtils
}: Props<T>): JSX.Element {
  const { callback, onSuccess, onError, onEnd } = asyncUtils
  const [pending, setPending] = useState(false)
  const [success, setSuccess] = useState<string>('')
  const [error, setError] = useState<string>('')

  function getMessage<MessageT>(
    event: string | ((res: MessageT) => string),
    result: MessageT
  ): string {
    if (typeof event === 'function') return event(result)
    return event
  }

  useEffect(() => {
    show()
    setPending(true)
    const noCallback = callback === undefined
    if (noCallback) throw new Error('Falta la función asincrona a resolver')

    callback()
      .then(res => {
        setPending(false)
        if (onSuccess !== undefined) setSuccess(getMessage(onSuccess, res))
        else setSuccess('Promise resolved💚')
        remove()
      })
      .catch(e => {
        setPending(false)
        if (onError !== undefined) setError(getMessage(onError, e))
        else setError('Promise rejected💔')
        remove()
      })
      .finally(onEnd)
  }, [])

  return (
    <>
      {pending && (
        <>
          {children}
          <DotWaveLoader size={30} speed={1} color='white' />
        </>
      )}
      {success.length > 0 && (
        <>
          <CircleCheck stroke='#0f0' />
          {success}
        </>
      )}
      {error.length > 0 && (
        <>
          <CircleX stroke='#f00' />
          {error}
        </>
      )}
    </>
  )
}
