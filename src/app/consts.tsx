export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL
const MODE = process.env.NEXT_PUBLIC_MODE

if (BACKEND_URL === undefined) throw new Error('Missing BACKEND_URL')
else if (MODE === undefined) throw new Error('Missing MODE')

export const IS_PROD_MODE = MODE === 'prod'

export const BACKEND_API = `${BACKEND_URL}/api`
export const STREAM_IMAGE = `${BACKEND_API}/stream/image`
export const PATH_ADMIN_INVENTORY = `${BACKEND_API}/admin/inventory`
export const PATH_INVENTORY = `${BACKEND_API}/inventory`

export const fillDataProduct = {
  name: 'Galleta amor chocolate',
  description: 'Descripción del producto...',
  image: '/favicon.ico',
  price: 1,
  cuantity: 5,
  section: 'Golosinas',
  barcode: Date.now()
}

export const fillDataSection = {
  name: 'Golosinas',
  image: '/favicon.ico'
}
