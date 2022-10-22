import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../src/lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const teams = ((await prisma.teams.findMany()) || []).map(team => ({
    label: team.name,
    value: team.id,
  }))

  res.status(200).json(teams)
}
