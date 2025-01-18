import { jtoast } from '@/packages/jtoast/Jtoast'
import { getErrorMessage } from '@/lib/server'
import { BACKEND_URL } from '@/app/consts'
import inventoryStyle from '@/css/Inventory.module.css'

export const $$ = (condition: boolean, style: string): string => {
  if (condition) return style
  else return ''
}

export const preparUrl = (
  url: string,
  query?: Record<string, unknown>
): string => {
  if (query === undefined) return url
  const params = new URLSearchParams()

  for (const key in query) {
    const value = query[key]
    const notString = typeof value !== 'string'
    const notNumber = typeof value !== 'number'
    const notArray = !Array.isArray(value)
    const notUndefined = value !== undefined
    const unexpectedType = notString && notNumber && notArray && notUndefined

    if (unexpectedType) throw new Error('Unexpected Type')
    if (value !== undefined && value !== null) {
      const toInsert = value.toString()
      params.append(key, toInsert)
    }
  }

  const stringParams = params.toString()
  if (stringParams.length > 0) url += `?${stringParams}`
  return url
}

export const getPosibleBlobUrl = (url: string): string => {
  if (url.includes('blob:http')) return url
  return `${BACKEND_URL}/api/stream/image/${url}`
}

export const copyToClipboard = async (
  value: string | number
): Promise<void> => {
  const imposible = navigator?.clipboard?.writeText === undefined

  let toCopy: string
  if (typeof value === 'number') toCopy = value.toString()
  else toCopy = value

  if (imposible) {
    jtoast('💔 La API de portapapeles no está disponible')
    return
  }

  await navigator.clipboard.writeText(toCopy)
  jtoast('Código de barras copiado al portapapeles 📋')
}

export const jtoastSync = (
  msg: string,
  callback: () => Promise<Partial<{ error: string; message: string }>>
): void => {
  jtoast(msg, {
    asyncUtils: {
      callback,
      onError: e => getErrorMessage(e),
      onSuccess: res => res.message ?? 'Exito'
    }
  })
}

export const jtoastAsync = (
  msg: string,
  callback: () => Promise<Partial<{ error: string; message: string }>>,
  onEnd?: () => void
): void => {
  jtoast(msg, {
    asyncUtils: {
      callback,
      onError: e => getErrorMessage(e),
      onSuccess: res => res.message ?? 'Exito',
      onEnd
    }
  })
}

export function $$updateable<T>(
  ever: string,
  field: keyof T,
  initial: T,
  compare: T | undefined
): string {
  let className = ever
  if (compare === undefined || compare === null) return ever
  const updating = compare !== undefined && compare[field] !== initial[field]
  if (updating) {
    if (field === 'image') className += ` ${inventoryStyle['updating-img']}`
    else className += ` ${inventoryStyle.updating}`
  }
  return className
}

// TODO: Optimize images or delete this function if it doesn't required

// export const imageLoader = ({
//   src,
//   width,
//   quality
// }: {
//   src: string
//   width: string
//   quality: number
// }): void => {
//   console.log(quality)
//   return `${process.env.NEXT_PUBLIC_BACKEND_URL}/${src}?w=${width}&q=${quality || 75}`
// }
