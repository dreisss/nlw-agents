import { ArrowLeft, AudioLines } from 'lucide-react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { QuestionForm } from '@/components/question-form'
import { QuestionList } from '@/components/question-list'
import { Button } from '@/components/ui/button'

type RoomParams = {
  roomId: string
}

export function Room() {
  const { roomId } = useParams<RoomParams>()

  if (!roomId) {
    return <Navigate replace to="/" />
  }

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="mx-auto flex max-w-4xl flex-col">
        <div className="flex justify-between">
          <Button asChild variant="outline">
            <Link to="/">
              <ArrowLeft /> Voltar ao Início
            </Link>
          </Button>

          <Button asChild variant="secondary">
            <Link to={`/room/${roomId}/audio`}>
              <AudioLines />
              Gravar Áudio
            </Link>
          </Button>
        </div>

        <div className="mt-6 mb-4 space-y-2">
          <h1 className="font-bold text-4xl">Sala de Perguntas</h1>

          <p className="text-muted-foreground">
            Faça perguntas e receba respostas com IA
          </p>
        </div>

        <QuestionForm roomId={roomId} />
        <QuestionList roomId={roomId} />
      </div>
    </div>
  )
}
