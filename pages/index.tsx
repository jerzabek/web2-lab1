import type { GetServerSideProps, GetStaticProps, NextPage } from 'next'
import prisma from '../lib/prisma'
import Profile from '../modules/Profile'
import { getSession } from '@auth0/nextjs-auth0'

const Home: NextPage = (props) => {
  return (
    <div>
      <main className='container py-2'>
        <h1>HNL</h1>
        <p>Rezultati utakmica iz HNL-a sezone 2022./2023.</p>
        <a href="/api/auth/login">Login</a>
        <a href="/api/auth/logout">Logout</a>
        <pre>{JSON.stringify(props)}</pre>
        <Profile />
      </main>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const feed = await prisma.teams.findMany();

  const session = getSession(req, res);

  return { props: { roles: session?.user['https://web2.lab1.fer.hr/roles'] || [], feed } }
}

export default Home
