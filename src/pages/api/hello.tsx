// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { type NextApiResponse } from 'next'
import { type NextRequest } from 'next/server'

type ResponseData = {
  name: string
}

export default function handler(
  req: NextRequest,
  res: NextApiResponse<ResponseData>
): void {
  res.status(200).json({ name: 'John Doe' })
}
