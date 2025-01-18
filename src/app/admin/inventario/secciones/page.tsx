import { type Metadata } from 'next'
import SectionsProvider from '@/context/Sections'
import { Sections } from '@/components/InventoryMain'
import { getSections } from '@/services/inventory'

export const metadata: Metadata = {
  title: 'Administración de secciones - JayoShop'
}

export default async function Secciones(): Promise<JSX.Element> {
  const sections = await getSections()

  return (
    <SectionsProvider sections={sections}>
      <Sections />
    </SectionsProvider>
  )
}
