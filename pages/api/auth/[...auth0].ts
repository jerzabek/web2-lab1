import { handleAuth, handleCallback, handleLogin, handleLogout } from '@auth0/nextjs-auth0'
import { NextApiRequest, NextApiResponse } from 'next'

function getUrls(req: NextApiRequest) {
  const host = req.headers['host']
  const protocol = process.env.VERCEL_URL ? 'https' : 'http'
  const redirectUri = `${protocol}://${host}/api/auth/callback`
  const returnTo = `${protocol}://${host}`
  return {
    redirectUri,
    returnTo,
  }
}

export default handleAuth({
  async callback(req: NextApiRequest, res: NextApiResponse) {
    try {
      const { redirectUri } = getUrls(req)
      await handleCallback(req, res, { redirectUri: redirectUri })
    } catch (error: any) {
      res.status(error.status || 500).end(error.message)
    }
  },

  async login(req: NextApiRequest, res: NextApiResponse) {
    try {
      const { redirectUri, returnTo } = getUrls(req)

      await handleLogin(req, res, {
        authorizationParams: {
          redirect_uri: redirectUri,
        },
        returnTo: returnTo,
      })
    } catch (error: any) {
      res.status(error.status || 400).end(error.message)
    }
  },

  async logout(req: NextApiRequest, res: NextApiResponse) {
    const { returnTo } = getUrls(req)
    await handleLogout(req, res, {
      returnTo: returnTo,
    })
  },
})
