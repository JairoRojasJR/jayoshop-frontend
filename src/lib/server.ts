import { jtoast } from '@/packages/jtoast/Jtoast'
import { isAxiosError } from 'axios'

export const getErrorMessage = (error: unknown): string => {
  let message: string
  const thereIsError = error !== undefined && error !== null
  const thereIsMessage =
    thereIsError && typeof error === 'object' && 'message' in error

  if (isAxiosError(error)) {
    const { response } = error
    if (response !== undefined) {
      const errorInBody = response.data.error
      if (typeof errorInBody !== 'string') {
        console.error(response.data)
        throw new Error('Unexpected Typeof error message from server')
      }
      message = errorInBody
    } else message = error.message
  } else if (error instanceof Error) message = error.message
  else if (thereIsMessage) message = String(error.message)
  else if (typeof error === 'string') message = error
  else message = 'Error desconocido'
  return message
}

export const toastError = (error: unknown): void => {
  jtoast(getErrorMessage(error))
}
