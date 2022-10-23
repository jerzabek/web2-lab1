import { teams } from '@prisma/client'
import { GetServerSideProps } from 'next'
import React from 'react'
import { Terminal } from 'react-feather'
import prisma from '../src/lib/prisma'

const WIN_POINTS = 3
const DRAW_POINTS = 2
const LOSS_POINTS = 1

interface Props {
  teams: Array<teams>
}

function Points({ teams }: Props) {
  return (
    <div>
      <h1>Poredak po bodovima</h1>

      <div className="row">
        <div className="col-xs-12 col-md-4">
          <table className="table table-responsive table-hover">
            <thead>
              <tr>
                <th>Team</th>
                <th style={{ width: '20px' }}>Points</th>
              </tr>
            </thead>
            <tbody>
              {teams.map(({ id, name, points }) => (
                <tr key={id}>
                  <td>{name}</td>
                  <td>{points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="col-xs-12 col-md-8">
          <p>Tim dobiva +3 boda za pobjedu, +2 boda za izjednačenje te +1 bod za poraz za svaku utakmicu u kojoj su sudjelovali</p>
        </div>
      </div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  const win_points: Array<{ win_points: number; id: number }> =
    await prisma.$queryRaw`SELECT teams.id, teams.name, (count(teams.id)*${WIN_POINTS})::integer as win_points
    FROM teams
    JOIN matches on (matches.home_team = teams.id or matches.away_team = teams.id)
    where matches.home_team = teams.id AND home_score > away_score
    OR
        matches.away_team = teams.id AND home_score < away_score
    group by teams.id;`

  const draw_points: Array<{ draw_points: number; id: number }> =
    await prisma.$queryRaw`SELECT teams.id, teams.name, (count(teams.id)*${DRAW_POINTS})::integer as draw_points
    FROM teams
    JOIN matches on (matches.home_team = teams.id or matches.away_team = teams.id)
    where home_score = away_score
    group by teams.id;`

  const loss_points: Array<{ loss_points: number; id: number }> =
    await prisma.$queryRaw`SELECT teams.id, teams.name, (count(teams.id)*${LOSS_POINTS})::integer as loss_points
    FROM teams
    JOIN matches on (matches.home_team = teams.id or matches.away_team = teams.id)
    where matches.home_team = teams.id AND home_score < away_score
    OR
        matches.away_team = teams.id AND home_score > away_score
    group by teams.id;`

  let teams = await prisma.teams.findMany({
    select: {
      id: true,
      name: true,
    },
  })

  teams = teams
    .map(team => {
      const w = win_points.find(win => win.id === team.id)?.win_points || 0
      const d = draw_points.find(draw => draw.id === team.id)?.draw_points || 0
      const l = loss_points.find(loss => loss.id === team.id)?.loss_points || 0

      return {
        ...team,
        points: w + d + l,
      }
    })
    .sort((a, b) => b.points - a.points)

  return {
    props: {
      teams,
    },
  }
}

export default Points
