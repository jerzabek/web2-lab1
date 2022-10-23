import { comments, matches } from '@prisma/client'
import type { GetServerSideProps, NextPage } from 'next'
import prisma from '../src/lib/prisma'
import MatchList from '../src/modules/Matches/MatchList'
import groupBy from '../src/utils/groupBy'

export interface Props {
  matches: {
    [key: string]: matches[]
  }
  comments: {
    [key: string]: comments[]
  }
}

const Home: NextPage<Props> = ({ matches, comments }: Props) => {
  return (
    <>
      <h1>HNL</h1>
      <p>Rezultati utakmica iz HNL-a sezone 2022./2023.</p>

      <MatchList matches={matches} comments={comments} />
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  let matches = await prisma.matches.findMany({
    include: {
      the_home_team: {
        select: {
          name: true,
          points: true,
        },
      },
      the_away_team: {
        select: {
          name: true,
          points: true,
        },
      },
    },
    orderBy: {
      timestamp: 'desc',
    },
  })

  if (matches) {
    matches = groupBy(matches, 'round')
  }

  let comments = await prisma.comments.findMany({
    orderBy: {
      created_at: 'desc',
    },
  })

  if (comments) {
    comments = groupBy(comments, 'round')
  }

  return {
    props: { matches: JSON.parse(JSON.stringify(matches)), comments: JSON.parse(JSON.stringify(comments)) },
  }
}

export default Home
