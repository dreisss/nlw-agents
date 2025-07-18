import { useGetHealth } from '@/kubb'

export function CreateRoom() {
  const { data, error, isLoading } = useGetHealth()
  // data é: [error, users] | undefined

  if (isLoading) {
    return <div>Carregando...</div>
  }

  if (error) {
    return <div>Erro: {error.message}</div>
  }

  return <div>{data}</div>
}
