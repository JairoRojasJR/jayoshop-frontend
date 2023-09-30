import type {
  GetProductServer,
  Product,
  Products,
  Section,
  Sections
} from '@/types'

const pathInventory = `${globalThis.backendUrl}/api/inventory`

export const getSections = async (
  setState?: React.Dispatch<React.SetStateAction<Sections>> | Section
): Promise<Sections> => {
  const url = `${pathInventory}/sections`
  const req = await fetch(url)
  const sections = await req.json()
  if (setState !== null && typeof setState === 'function') {
    setState(sections)
    return sections
  }
  return sections
}

export const getMostPopularsProducts = async (): Promise<Products> => {
  const url = `${pathInventory}/products/mostPopulars?max=4`
  const req = await fetch(url)
  return await req.json()
}

export const getProducts = async (
  query?: GetProductServer<Product>,
  setState?: React.Dispatch<React.SetStateAction<Products>>
): Promise<Product | []> => {
  let url = `${pathInventory}/products`

  if (query !== undefined) {
    const params = new URLSearchParams()
    url += '?'
    for (const key in query) {
      const value = query[key as keyof Product]
      if (value !== undefined) params.append(key, value)
    }
    url += params.toString()
  }

  const req = await fetch(url)
  const products = await req.json()
  if (setState !== undefined) {
    setState(products)
    return products
  }

  return products
}
