import { useGetRooms } from '@/kubb'
import { Link } from 'react-router-dom'

export function CreateRoom() {
  const { data, error, isLoading } = useGetRooms()

  if (isLoading) {
    return <div>Carregando...</div>
  }

  if (error) {
    return <div>Erro: {error.message}</div>
  }

  return (
    <ul>
      {data?.map((room) => (
        <li key={room.id}>
          <Link to={`/room/${room.id}`}>{room.name}</Link>
        </li>
      ))}
    </ul>
  )
}
