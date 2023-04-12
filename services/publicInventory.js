const getPathInventory = () => `${globalThis.backendUrl}/api/inventory`

// Data Product for tests in development
export const getDevDataProduct = () => {
  if (globalThis.mode !== 'dev' && globalThis.mode !== 'preprod') return null

  const devDataProduct = {
    name: 'Galleta amor chocolate',
    description: 'Descripción del producto...',
    image: 'products/pepsy_2-5l--id--7ebho.jpg?width=3840',
    price: 1,
    cuantity: 5,
    section: 'Golosinas',
    barcode: 999
  }

  return devDataProduct
}
// ---

export const getSections = async setState => {
  const url = `${getPathInventory()}/sections`
  const req = await fetch(url)
  const sections = await req.json()
  if (setState) return setState(sections)
  return sections
}

export const getMostPopularsProducts = async () => {
  const url = `${getPathInventory()}/products/mostPopulars?max=4`
  const req = await fetch(url)
  return req.json()
}

export const getProducts = async (section, setState) => {
  let url = `${getPathInventory()}/products`
  if (section) url += `?section=${section}`
  const req = await fetch(url)
  const products = await req.json()
  if (setState) return setState(products)
  return products
}
