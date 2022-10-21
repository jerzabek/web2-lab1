import Image from "next/image"
import { useUser } from '@auth0/nextjs-auth0'

const Profile = () => {
  const { user, error, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;
  if (!user) return <div>Can not load user</div>;

  return (
    <div>
      <Image src={user.picture || ''} alt={user.name || 'user image'} width={64} height={64} />
      <h2>{user.name}</h2>
      <p>{user.email}</p>
      user:
      <pre>
        {JSON.stringify(user)}
      </pre>
    </div>
  );
}

export default Profile
