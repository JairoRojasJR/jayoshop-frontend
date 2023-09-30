export const checkFetchFailed = (errorMessage: string): boolean => {
  const includes = (typeErrorOnNavigators: string): boolean => {
    return errorMessage.includes(typeErrorOnNavigators)
  }

  return (
    includes('NetworkError') ||
    includes('TypeError') ||
    includes('Failed to fetch')
  )
}
