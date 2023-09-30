import { closeModal } from '@/components/global/Modal'
import { jtoast } from '@/packages/jtoast/Jtoast'
import type {
  Product,
  ProductServer,
  OnSuccesServer,
  ServerResponse,
  SectionServer,
  IdObjectServer,
  MultiTrashServer,
  InvoiceProduct
} from '@/types'
import { type GetServerSidePropsContext } from 'next'

const pathInventory = `${globalThis.backendUrl}/api/admin/inventory`
const pathProducts = `${pathInventory}/products`
const pathSections = `${pathInventory}/sections`

// Data Product for tests in development
export const getDevDataProduct = (): Product => {
  const devDataProduct = {
    _id: 'xxx',
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
export const addSection = async (section: FormData): Promise<SectionServer> => {
  const req = await fetch(pathSections, {
    credentials: 'include',
    method: 'POST',
    body: section
  })
  return await req.json()
}

export const updateSection = async (
  section: FormData
): Promise<SectionServer> => {
  const req = await fetch(pathSections, {
    credentials: 'include',
    method: 'PUT',
    body: section
  })
  return await req.json()
}

export const deleteSection = async (
  id: IdObjectServer | IdObjectServer[]
): Promise<MultiTrashServer> => {
  const req = await fetch(pathSections, {
    credentials: 'include',
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(id)
  })
  return await req.json()
}

// Products
export const addProduct = async (product: FormData): Promise<ProductServer> => {
  const req = await fetch(pathProducts, {
    credentials: 'include',
    method: 'POST',
    body: product
  })
  return await req.json()
}

export const updateProduct = async (
  product: FormData
): Promise<ProductServer> => {
  const req = await fetch(pathProducts, {
    credentials: 'include',
    method: 'PUT',
    body: product
  })
  return await req.json()
}

export const deleteProduct = async (
  product: IdObjectServer | IdObjectServer[]
): Promise<MultiTrashServer> => {
  const req = await fetch(pathProducts, {
    credentials: 'include',
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product)
  })
  return await req.json()
}

export const invoiceProduct = async (
  products: InvoiceProduct[]
): Promise<ServerResponse> => {
  const url = `${pathInventory}/seller`
  const req = await fetch(url, {
    credentials: 'include',
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(products)
  })
  return await req.json()
}

type ServerSideProps = {
  props: { isAuthenticated: boolean }
}

// Check Authentication
export async function checkAuth(
  context: GetServerSidePropsContext
): Promise<ServerSideProps> {
  const cookies = context.req.headers.cookie
  const auth = cookies
    ?.split('; ')
    ?.find(row => row.startsWith('auth'))
    ?.split('=')[1]

  if (auth === 'admin-false' || auth === 'client-true') {
    context.res.writeHead(302, { Location: '/' })
    context.res.end()
  }

  return {
    props: {
      isAuthenticated: false
    }
  }
}

export const handleRes = (
  res: ServerResponse,
  onSuccess: OnSuccesServer
): void => {
  if (res.error !== undefined) {
    jtoast(res.error)
  } else {
    if (res.message !== undefined) jtoast(res.message)
    if (onSuccess !== undefined) onSuccess()
    closeModal()
  }
}
