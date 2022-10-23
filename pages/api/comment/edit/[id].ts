import { getSession } from '@auth0/nextjs-auth0'
import moment, { now } from 'moment'
import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../../src/lib/prisma'
import { ROLES } from '../../../../src/utils/consts'

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') res.status(403)

  const { id } = req.query

  const { text }: { text: string } = req.body

  const session = getSession(req, res)

  if (!session?.user) {
    res.status(400).json({ success: false })
    return
  }

  const comment = await prisma.comments.findFirst({
    where: {
      id: Number(id),
    },
  })

  if (!comment) {
    res.status(400).json({ success: false })
    return
  }

  const isAuthor = session.user.email === comment.user

  if (!session.user[ROLES]?.includes('admin') && !isAuthor) {
    res.status(400).json({ success: false, no: 'no' })
    return
  }

  try {
    await prisma.comments.update({
      data: {
        modified_at: moment()
          .add(moment.duration({ hours: 2 })) // dumb solution - but works
          .toDate(),
        text,
      },
      where: {
        id: Number(id),
      },
    })

    res.status(200).json({ success: true })
  } catch (e) {
    console.log(e)
    res.status(400).json({ success: false })
  }
}
