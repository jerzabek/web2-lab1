import { matches } from '@prisma/client'
import type { GetServerSideProps, NextPage } from 'next'
import prisma from '../src/lib/prisma'
import MatchList from '../src/modules/Matches/MatchList'
import groupBy from '../src/utils/groupBy'

export interface Props {
  matches: {
    [key: string]: matches[]
  }
}

const Home: NextPage<Props> = ({ matches }: Props) => {
  return (
    <>
      <h1>HNL</h1>
      <p>Rezultati utakmica iz HNL-a sezone 2022./2023.</p>

      <div className="row">
        <div className="col-xs-12 col-md-6 col-lg-4">
          <MatchList matches={matches} />
        </div>
      </div>
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

  return {
    props: { matches: JSON.parse(JSON.stringify(matches)) },
  }
}

export default Home
