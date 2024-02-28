export const IS_PROD_MODE = process.env.NEXT_PUBLIC_MODE === 'prod'
export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL
export const STREAM_IMAGE = `${BACKEND_URL}/api/stream/image`
