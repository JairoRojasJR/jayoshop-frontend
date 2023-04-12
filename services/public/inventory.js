const pathInventory = `${globalThis.backendUrl}/api/inventory`

export const getSections = async setState => {
  const url = `${pathInventory}/sections`
  const req = await fetch(url)
  const sections = await req.json()
  if (setState) return setState(sections)
  return sections
}

export const getMostPopularsProducts = async () => {
  const url = `${pathInventory}/products/mostPopulars?max=4`
  const req = await fetch(url)
  return req.json()
}

export const getProducts = async (section, setState) => {
  let url = `${pathInventory}/products`
  if (section) url += `?section=${section}`
  const req = await fetch(url)
  const products = await req.json()
  if (setState) return setState(products)
  return products
}
