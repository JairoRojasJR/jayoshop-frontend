'use client'
import { createContext, useContext } from 'react'
import useSections from '@/hooks/sections'
import type { Section } from '@/types/server'

type Props = {
  children: React.ReactNode
  sections: Section[]
}

export type Hook = {
  current: Section[]
  show: boolean
  multiSelect: boolean
  selecteds: string[]
  printAdd: (added: Section) => void
  printUpdate: (updated: Section) => void
  printDelete: (_id: string | string[]) => void
  runShow: (show: boolean) => void
  toggleMultiSelect: () => void
  selectSection: (_id: string) => void
}

const SectionsContext = createContext<Hook>(undefined as unknown as Hook)

export default function SectionsProvider({
  children,
  sections
}: Props): JSX.Element {
  const hook = useSections(sections)

  return (
    <SectionsContext.Provider value={hook}>{children}</SectionsContext.Provider>
  )
}

export function useSectionsContext(): Hook {
  return useContext(SectionsContext)
}
