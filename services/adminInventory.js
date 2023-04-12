const getPathInventory = () => `${globalThis.backendUrl}/api/admin/inventory`
const getPathProducts = () => `${getPathInventory()}/products`
const getPathSections = () => `${getPathInventory()}/sections`
const optionsFetching = { credentials: 'include' }

// Sections
export const addSection = async section => {
  const options = { ...optionsFetching }
  options.method = 'POST'
  options.body = section
  const req = await fetch(getPathSections(), options)
  return await req.json()
}

export const updateSection = async section => {
  const options = { ...optionsFetching }
  options.method = 'PUT'
  options.body = section
  const req = await fetch(getPathSections(), options)
  return await req.json()
}

export const deleteSection = async section => {
  const options = { ...optionsFetching }
  options.method = 'DELETE'
  options.headers = { 'Content-Type': 'application/json' }
  options.body = JSON.stringify(section)
  const req = await fetch(getPathSections(), options)
  return await req.json()
}

// Products
export const addProduct = async product => {
  const options = { ...optionsFetching }
  options.method = 'POST'
  options.body = product
  const req = await fetch(getPathProducts(), options)
  return await req.json()
}

export const updateProduct = async product => {
  const options = { ...optionsFetching }
  options.method = 'PUT'
  options.body = product
  const req = await fetch(getPathProducts(), options)
  return await req.json()
}

export const deleteProduct = async product => {
  const options = { ...optionsFetching }
  options.method = 'DELETE'
  options.headers = { 'Content-Type': 'application/json' }
  options.body = JSON.stringify(product)
  const req = await fetch(getPathProducts(), options)
  return await req.json()
}
