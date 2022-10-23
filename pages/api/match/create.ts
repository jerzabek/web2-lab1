import { getSession } from '@auth0/nextjs-auth0'
import moment from 'moment'
import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../src/lib/prisma'
import { ROLES } from '../../../src/utils/consts'

interface CreatePostRequest extends NextApiRequest {
  body: {
    homeTeam: number
    awayTeam: number
    homeScore?: number
    awayScore?: number
    timestamp: number
    round: number
  }
}

export default async function handle(req: CreatePostRequest, res: NextApiResponse) {
  if (req.method !== 'POST') res.status(403)

  const { homeTeam, awayTeam, homeScore, awayScore, timestamp, round } = req.body

  const session = getSession(req, res)

  if (!session?.user[ROLES]?.includes('admin')) {
    res.status(400).json({ success: false })
    return
  }

  try {
    await prisma.matches.create({
      data: {
        home_score: homeScore,
        away_score: awayScore,
        round,
        timestamp: moment.unix(timestamp).toDate(),
        the_home_team: { connect: { id: homeTeam } },
        the_away_team: { connect: { id: awayTeam } },
      },
    })

    res.status(200).json({ success: true })
  } catch (e) {
    res.status(400).json({ success: false })
  }
}
