const pathInventory = `${globalThis.backendUrl}/api/admin/inventory`
const pathProducts = `${pathInventory}/products`
const pathSections = `${pathInventory}/sections`
const optionsFetching = { credentials: 'include' }

// Data Product for tests in development
export const getDevDataProduct = () => {
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

// Sections
export const addSection = async section => {
  const options = { ...optionsFetching }
  options.method = 'POST'
  options.body = section
  const req = await fetch(pathSections, options)
  return await req.json()
}

export const updateSection = async section => {
  const options = { ...optionsFetching }
  options.method = 'PUT'
  options.body = section
  const req = await fetch(pathSections, options)
  return await req.json()
}

export const deleteSection = async section => {
  const options = { ...optionsFetching }
  options.method = 'DELETE'
  options.headers = { 'Content-Type': 'application/json' }
  options.body = JSON.stringify(section)
  const req = await fetch(pathSections, options)
  return await req.json()
}

// Products
export const addProduct = async product => {
  const options = { ...optionsFetching }
  options.method = 'POST'
  options.body = product
  const req = await fetch(pathProducts, options)
  return await req.json()
}

export const updateProduct = async product => {
  const options = { ...optionsFetching }
  options.method = 'PUT'
  options.body = product
  const req = await fetch(pathProducts, options)
  return await req.json()
}

export const deleteProduct = async product => {
  const options = { ...optionsFetching }
  options.method = 'DELETE'
  options.headers = { 'Content-Type': 'application/json' }
  options.body = JSON.stringify(product)
  const req = await fetch(pathProducts, options)
  return await req.json()
}

export const invoiceProduct = async products => {
  const url = `${pathInventory}/seller`
  const options = { ...optionsFetching }
  options.method = 'PUT'
  options.headers = { 'Content-Type': 'application/json' }
  options.body = JSON.stringify(products)
  const req = await fetch(url, options)
  return await req.json()
}

// Check Authentication
export const checkAuth = context => {
  const cookies = context.req.headers.cookie
  const auth = cookies
    .split('; ')
    .find(row => row.startsWith('auth'))
    .split('=')[1]

  if (auth === 'admin-false' || auth === 'client-false') {
    context.res.writeHead(302, { Location: '/login' })
    context.res.end()
  }

  return {
    props: {
      isAuthenticated: true
    }
  }
}
