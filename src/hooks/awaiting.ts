import { useState } from 'react'

type Hook = { awaiting: boolean; enable: () => void; disable: () => void }

export default function useAwaiting(): Hook {
  const [awaiting, setAwaiting] = useState(false)
  const enable = (): void => setAwaiting(false)
  const disable = (): void => setAwaiting(true)
  return { awaiting, enable, disable }
}
