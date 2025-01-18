export type Props<Result> = {
  children: string
  options?: {
    duration?: number
    asyncUtils?: {
      callback: () => Promise<Result>
      onSuccess?: string | ((res: Result) => string)
      onError?: string | ((res: unknown) => string)
      onEnd?: () => void
    }
  }
  id: string
}

export type ItemsContentProps = {
  children: string
  show: () => void
  remove: () => void
}
