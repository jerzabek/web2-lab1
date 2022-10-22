import moment from 'moment'
import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../src/lib/prisma'

interface EditPostRequest extends NextApiRequest {
  body: {
    id: number
    homeTeam: number
    awayTeam: number
    homeScore?: number
    awayScore?: number
    timestamp: number
    round: number
  }
}

export default async function handle(req: EditPostRequest, res: NextApiResponse) {
  if (req.method !== 'POST') res.status(403)

  const { id, homeTeam, awayTeam, homeScore, awayScore, timestamp, round } = req.body

  // const session = getSession(req, res)

  try {
    await prisma.matches.update({
      data: {
        home_score: homeScore,
        away_score: awayScore,
        round,
        timestamp: moment.unix(timestamp).toDate(),
        the_home_team: { connect: { id: homeTeam } },
        the_away_team: { connect: { id: awayTeam } },
      },
      where: {
        id,
      },
    })

    res.status(200).json({ success: true })
    return
  } catch (e) {
    res.status(400).json({ success: false })
  }
}
