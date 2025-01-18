'use client'
import { createContext, useContext } from 'react'
import useViewInsert from '@/hooks/viewInsert'

export type Hook = {
  insert: boolean
  opening: () => void
  closing: () => void
}

const ViewInsertContext = createContext(undefined as unknown as Hook)

export default function ViewInsertProvider({
  children
}: {
  children: React.ReactNode
}): JSX.Element {
  const hook = useViewInsert()

  return (
    <ViewInsertContext.Provider value={hook}>
      {children}
    </ViewInsertContext.Provider>
  )
}

export function useViewInsertContext(): Hook {
  return useContext(ViewInsertContext)
}
