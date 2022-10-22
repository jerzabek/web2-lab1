import { matches, teams } from '@prisma/client'
import moment from 'moment'
import Link from 'next/link'
import React from 'react'
import { Edit } from 'react-feather'
import useIsAdmin from '../../../utils/isAdmin'
import { Score, ScoreWrapper, Teams, TimeCell } from './styles'

interface Props {
  match: matches
}

type winner = 'home' | 'away' | 'draw' | 'none'

function Match({ match }: Props) {
  /*
  Stupid prisma doesn't work good with nextJS because getServerSideProps needs to serialize data
  into JSON when hydrating the frontend but typesafety gets lost when that happens and the relations
  the_home_team the_away_team become a mystery so we must use @ts-ignore
  */
  //@ts-ignore
  const homeTeam: teams = match.the_home_team
  //@ts-ignore
  const awayTeam: teams = match.the_away_team

  const date = moment(match.timestamp)

  const isAdmin = useIsAdmin()

  let win: winner

  if (match.home_score === null || match.away_score === null) {
    win = 'none'
  } else if (match.home_score > match.away_score) {
    win = 'home'
  } else if (match.home_score < match.away_score) {
    win = 'away'
  } else {
    win = 'draw'
  }
  return (
    <tr>
      <td>
        <TimeCell className="text-secondary">
          <span>{date.format('HH:mm')}</span>
          <span>{date.format('DD.MM.YY.')}</span>
        </TimeCell>
      </td>
      <td>
        <ScoreWrapper>
          <Teams finished={win !== 'none'}>
            <span className={win === 'home' ? 'winner' : ''}>{homeTeam.name}</span>
            <span className={win === 'away' ? 'winner' : ''}>{awayTeam.name}</span>
          </Teams>
          <Score>
            <span className={win === 'home' ? 'winner' : ''}>{match.home_score}</span>
            <span className={win === 'away' ? 'winner' : ''}>{match.away_score}</span>
          </Score>
        </ScoreWrapper>
      </td>
      {isAdmin && (
        <td>
          <Link href={`/edit/${match.id}`}>
            <a>
              <Edit />
            </a>
          </Link>
        </td>
      )}
    </tr>
  )
}

export default Match
