import Image from 'next/image'
import { useUser } from '@auth0/nextjs-auth0'

const Profile = () => {
  const { user, error, isLoading } = useUser()

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>{error.message}</div>
  if (!user) return <div>Can not load user</div>

  return (
    <div className="row">
      <div className="col-xs-12 col-sm-2">
        <Image src={user.picture || ''} alt={user.name || 'user image'} width={128} height={128} />
      </div>
      <div className="col-xs-12 col-sm-10">
        <h2>{user.name}</h2>
        <p>{user.email}</p>
      </div>
    </div>
  )
}

export default Profile
