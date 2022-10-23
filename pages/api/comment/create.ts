import { getSession } from '@auth0/nextjs-auth0'
import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../src/lib/prisma'

interface CreateCommentRequest extends NextApiRequest {
  body: {
    text: string
    round: number
  }
}

export default async function handle(req: CreateCommentRequest, res: NextApiResponse) {
  if (req.method !== 'POST') res.status(403)

  const { text, round } = req.body

  const session = getSession(req, res)

  try {
    await prisma.comments.create({
      data: {
        text,
        round,
        user: session?.user.email,
      },
    })

    res.status(200).json({ success: true })
  } catch (e) {
    console.log(e)
    res.status(400).json({ success: false })
  }
}
