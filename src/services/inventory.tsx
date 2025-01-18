import axios from 'axios'
import { preparUrl } from '@/lib/local'
import { PATH_INVENTORY, PATH_ADMIN_INVENTORY } from '@/app/consts'

import type {
  Product,
  ProductNotUniqueKeys,
  ProductUniqueKeys,
  PickId,
  Section,
  AddedSection,
  DeletedSection,
  UpdatedSection,
  InvoiceProduct,
  AddedProduct,
  UpdatedProduct,
  DeletedProduct,
  InvoicedProduct
} from '@/types/server'

const PATH_SECTIONS = `${PATH_INVENTORY}/sections`

export const getSections = async (): Promise<Section[]> => {
  const req = await axios(PATH_SECTIONS)
  return req.data
}

const PATH_ADMIN_SECTIONS = `${PATH_ADMIN_INVENTORY}/sections`

export const addSection = async (section: FormData): Promise<AddedSection> => {
  const req = await axios.post(PATH_ADMIN_SECTIONS, section, {
    withCredentials: true
  })
  return req.data
}

export const updateSection = async (
  section: FormData
): Promise<UpdatedSection> => {
  const req = await axios.put(PATH_ADMIN_SECTIONS, section, {
    withCredentials: true
  })
  return req.data
}

export const deleteSection = async (
  id: PickId | PickId[]
): Promise<DeletedSection> => {
  const req = await axios.delete(PATH_ADMIN_SECTIONS, {
    data: id,
    withCredentials: true
  })
  return req.data
}

const PATH_PRODUCTS = `${PATH_INVENTORY}/products`

export const getMostPopularsProducts = async (): Promise<Product[]> => {
  const url = preparUrl(`${PATH_PRODUCTS}/mostPopulars`, { max: 4 })
  const req = await axios(url)
  return req.data
}

export const getProduct = async (
  query?: Partial<ProductUniqueKeys>
): Promise<Product> => {
  const url = preparUrl(PATH_PRODUCTS, query)
  const req = await axios(url)
  return req.data
}

export const getProducts = async (
  query?: Partial<ProductNotUniqueKeys>
): Promise<Product[]> => {
  const url = preparUrl(PATH_PRODUCTS, query)
  const req = await axios(url)
  return req.data
}

const PATH_ADMIN_PRODUCTS = `${PATH_ADMIN_INVENTORY}/products`

export const addProduct = async (product: FormData): Promise<AddedProduct> => {
  const req = await axios.post(PATH_ADMIN_PRODUCTS, product, {
    withCredentials: true
  })
  return req.data
}

export const updateProduct = async (
  product: FormData
): Promise<UpdatedProduct> => {
  const req = await axios.put(PATH_ADMIN_PRODUCTS, product, {
    withCredentials: true
  })
  return req.data
}

export const deleteProduct = async (
  product: PickId | PickId[]
): Promise<DeletedProduct> => {
  const req = await axios.delete(PATH_ADMIN_PRODUCTS, {
    data: product,
    withCredentials: true
  })
  return req.data
}

export const invoiceProduct = async (
  products: InvoiceProduct[]
): Promise<InvoicedProduct> => {
  const req = await axios.put(`${PATH_ADMIN_INVENTORY}/seller`, products, {
    withCredentials: true
  })
  return req.data
}

export default {
  getSections,
  addSection,
  updateSection,
  deleteSection,
  getProduct,
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  invoiceProduct
}
