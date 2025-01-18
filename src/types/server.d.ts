export type ServerError = { error: string }
export type ServerResWithMsg<T> = { message: string } & T

export type PickId = { _id: string }

export type AuthData = {
  rol: 'admin' | 'client'
  isAuthenticated: boolean
}

type Auth = { authData: AuthData }

export type Login = {
  username: string
  password: string
}

export type ChangeAuthStatus = ServerResWithMsg<Auth>

export type Section = {
  _id: string
  name: string
  image: string
}

export type Product = {
  _id: string
  name: string
  description: string
  image: string
  price: number
  cuantity: number
  section: string
  barcode: number
}

export type ProductUniqueKeys = Pick<
  Product,
  '_id' | 'name' | 'image' | 'barcode'
>

export type ProductNotUniqueKeys = Pick<
  Product,
  'description' | 'price' | 'cuantity' | 'section'
>

type InventoryRes<T> = ServerResWithMsg<T>

type AddedToInventory<T> = InventoryRes<{ added: T }>
type UpdatedFromInventory<T> = InventoryRes<{ updated: T }>
type DeletedFromInventory<T> = InventoryRes<{ deleted: T }>

export type AddedProduct = AddedToInventory<Product>
export type UpdatedProduct = UpdatedFromInventory<Product>
export type DeletedProduct = DeletedFromInventory<Product>

export type InvoiceProduct = { _id: string; cuantity: number }
export type InvoicedProduct = ServerResWithMsg<InvoiceProduct>

export type AddedSection = AddedToInventory<Section>
export type UpdatedSection = UpdatedFromInventory<Section>
export type DeletedSection = DeletedFromInventory<Section>
