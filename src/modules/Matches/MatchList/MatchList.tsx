import { comments, matches } from '@prisma/client'
import React from 'react'
import useIsAdmin from '../../../utils/isAdmin'
import CommentList from '../../Comments/CommentList'
import Match from './Match'
import { TimeHeader } from './styles'

// Matches are grouped by round
export interface Props {
  matches: {
    [key: string]: matches[]
  }
  comments: {
    [key: string]: comments[]
  }
}

function MatchList({ matches, comments }: Props) {
  const isAdmin = useIsAdmin()

  return (
    <>
      {Object.keys(matches).map(round => (
        <div className="row" key={round}>
          <div className="col-xs-12 col-md-6 col-lg-4">
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
          </div>
          <div className="col-xs-12 col-md-6 col-ld-8">
            <CommentList comments={comments[round] || []} round={Number(round)} />
          </div>
          <hr className="mt-3" />
        </div>
      ))}
    </>
  )
}

export default MatchList
