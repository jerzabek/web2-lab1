import { matches } from '@prisma/client'
import React from 'react'
import useIsAdmin from '../../../utils/isAdmin'
import Match from './Match'
import { TimeHeader } from './styles'

// Matches are grouped by round
export interface Props {
  matches: {
    [key: string]: matches[]
  }
}

function MatchList({ matches }: Props) {
  const isAdmin = useIsAdmin()

  return (
    <>
      {Object.keys(matches).map(round => (
        <React.Fragment key={round}>
          <h2 className="mb-0">Kolo {round}</h2>
          <table className="table table-responsive table-hover">
            <thead>
              <tr>
                <TimeHeader></TimeHeader>
                <th></th>
                {isAdmin && <th style={{ width: '10%' }}></th>}
              </tr>
            </thead>
            <tbody>
              {matches[round].map(match => (
                <Match key={match.id} match={match} />
              ))}
            </tbody>
          </table>
        </React.Fragment>
      ))}
    </>
  )
}

export default MatchList
