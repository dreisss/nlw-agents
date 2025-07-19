import { Bot, LoaderCircle, MessageSquare } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

type Props = {
  question: {
    id: string
    question: string
    answer?: string
    createdAt: string
  }
}

export function QuestionItem({ question }: Props) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-6">
        <div className="flex gap-3">
          <span className="flex size-10 items-center justify-center rounded-full bg-muted">
            <MessageSquare className="size-4.5" />
          </span>

          <div className="space-y-1">
            <p>Pergunta</p>

            <p className="text-muted-foreground text-sm">{question.question}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <span className="flex size-10 items-center justify-center rounded-full bg-muted">
            <Bot className="size-4.5" />
          </span>

          <div className="space-y-1">
            <p>Resposta da IA</p>

            <p className="flex items-center gap-2 text-muted-foreground text-sm">
              {question.answer ?? (
                <>
                  <LoaderCircle className="size-4 animate-spin" />
                  <span className="italic">Gerando respostas...</span>
                </>
              )}
            </p>
          </div>
        </div>

        <p className="text-end text-muted-foreground text-sm italic">
          em poucos segundos
        </p>
      </CardContent>
    </Card>
  )
}
