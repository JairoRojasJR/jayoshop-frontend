export const checkFetchFailed = errorMessage => {
  const includes = string => errorMessage.includes(string)
  return (
    includes('NetworkError') ||
    includes('TypeError') ||
    includes('Failed to fetch')
  )
}
