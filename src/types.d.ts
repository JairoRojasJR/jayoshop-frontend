type SVGProps = {
  stroke?: `#${string}` | `var(--${string})`
  className?: string
  style?: React.CSSProperties
}

type ErrorHandle = {
  message: string
}

export interface AuthData {
  isAdmin: boolean
  rol: 'admin' | 'client'
  isIpAdmin: boolean
  ip: string
  cleanIp: string
  isAuthenticated: boolean
  isAdminAuthenticated: boolean
  serverStatus: 'connecting' | 'connected' | 'failed'
}

export interface IsAuthContextType {
  isAuthContext: AuthData
  setIsAuthContext: (data: AuthData) => void
}

export interface IsAuthContextProviderProps {
  children: React.ReactNode
}

export type Toggle = 0 | 1

export type Login = {
  username: string
  password: string
}

export type AuthenticatingServer = ServerResponse & { authData: AuthData }

export type TransitionProperties = {
  from: React.CSSProperties
  to: React.CSSProperties
}

export interface Transition extends MainTransition {
  element: HTMLElement
  display?: 'run' | (() => void)
  properties: TransitionProperties | (() => TransitionProperties)
}

export type Transitions = Transition[]

export type TransitionPhase = 'start' | 'end'

export type AdminLogistics = 'Nuevo producto' | 'Secciones' | ''
export type AdminLogisticsObject = { name: AdminLogistics }

export type SectionWithoutId = {
  name: string
  image: string
}

export interface Section extends SectionWithoutId {
  _id: string
}

export type Sections = Section[]

export type ProductWithoutId = {
  name: string
  description: string
  image: string
  price: number
  cuantity: number
  section: string
  barcode: number
}

export interface Product extends ProductWithoutId {
  _id: string
}

export type Products = Product[]

export type GetProductServer<T> = {
  [K in keyof T]?: string
}

export type AdminAction = 'editar' | 'eliminar' | 'multieliminar' | ''
export type UpdatingSection = {
  name: boolean
  description: boolean
  image: boolean
  price: boolean
  cuantity: boolean
  section: boolean
  barcode: boolean
}

export type UpdatingProduct = UpdatingSection

type FormSources = {
  hiddenId?: string
  title: string
  goal?: string
  runSubmit?: Promise
}

type ServerResponse = { message?: string; error?: string }
type OnSuccesServer = () => void

type IdObjectServer = { _id: string }
type IdServer = Promise<ServerResponse>
type SendId = (id: IdObjectServer) => Promise<IdServer>

type ProductServer = Promise<ServerResponse & Product>
type SendProduct = (formData: FormData) => Promise<ProductServer>

type SectionServer = Promise<ServerResponse & Section>
type SendSection = (formData: FormData) => Promise<SectionServer>

type DeletingServer = { deleting: { count: number; db: boolean } }
type ErrorDeletingServer = { db: boolean; blob: boolean }

type TargetServer = 'product' | 'section'

type ErrorDeletingProductServer = DeletingServer & {
  product: Product
} & ErrorDeletingServer

type ErrorDeletingSectionServer = DeletingServer & {
  section: Section
  haveProducts: boolean
  productsMatched: Product[]
  products?: ErrorDeletingProductServer
} & ErrorDeletingServer

type MultiTrashingServer = DeletingProductServer | ErrorDeletingSectionServer
type MultiTrashServer = Promise<ServerResponse & MultiTrashingServer>
type SendMultiTrashServer = (id: IdObjectServer[]) => Promise<MultiTrashServer>

type InvoiceProduct = { _id: string; cuantity: number }
