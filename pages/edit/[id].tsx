import Router, { useRouter } from 'next/router'
import React from 'react'
import { getServerSidePropsWrapper, getSession } from '@auth0/nextjs-auth0'
import prisma from '../../src/lib/prisma'
import { ROLES } from '../../src/utils/consts'
import MatchForm from '../../src/modules/Matches/MatchForm'
import moment from 'moment'
import postJson from '../../src/api/post'
import { FormData } from '../../src/modules/Matches/MatchForm/MatchForm'

interface Props {
  match: string
}

function EditMatch({ match }: Props) {
  
  const router = useRouter()

  const { id } = router.query

  const handleSubmit = async (data: FormData) => {
    try {
      await postJson(`/api/match/edit`, { ...data, id: Number(id) })

      Router.push('/')
    } catch (e) {
      console.log('err occurred', e)
    }
  }

  return (
    <div className="row">
      <div className="col-xs-12 col-sm-6">
        <h2>Uredi utakmicu</h2>
        <MatchForm onSubmit={handleSubmit} formValues={JSON.parse(match)} />
      </div>
    </div>
  )
}

export const getServerSideProps = getServerSidePropsWrapper(async ctx => {
  const match = await prisma.matches.findFirst({
    where: {
      id: Number(ctx.params?.id),
    },
  })

  const session = getSession(ctx.req, ctx.res)
  if (session) {
    if (session.user[ROLES]?.includes('admin') && match) {
      return {
        props: {
          match: JSON.stringify({
            homeTeam: match.home_team,
            awayTeam: match.away_team,
            homeScore: match.home_score,
            awayScore: match.away_score,
            round: match.round,
            timestamp: moment(match.timestamp).unix(),
          }),
        },
      }
    }
  }

  return {
    redirect: {
      destination: '/',
    },
    props: {},
  }
})

export default EditMatch
