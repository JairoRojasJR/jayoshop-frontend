import { useEffect } from 'react'
import type { ItemsContentProps } from './types'

export default function Sync({
  children,
  show,
  remove
}: ItemsContentProps): JSX.Element {
  useEffect(() => {
    show()
    remove()
  }, [])

  return <>{children}</>
}
