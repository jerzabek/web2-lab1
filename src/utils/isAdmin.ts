import { useUser } from '@auth0/nextjs-auth0'
import { ROLES } from './consts'

const useIsAdmin = () => {
  const { user } = useUser()


  return user && (user[ROLES] as Array<string>)?.includes('admin')
}

export default useIsAdmin
