import { jtoast } from '@/packages/jtoast/Jtoast'

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
