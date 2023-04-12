import { jtoast } from '@/packages/jtoast/Jtoast'

export const copyToClipboard = str => {
  if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
    jtoast('Código de barras copiado al portapapeles 📋', { duration: 3000 })
    return navigator.clipboard.writeText(str)
  }
  return jtoast('💔 La API de portapapeles no está disponible', {
    duration: 3000
  })
}
