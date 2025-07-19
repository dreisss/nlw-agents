import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import z from 'zod'
import type { PostRoomsByRoomIdQuestionsMutationRequest } from '@/kubb'
import { Button } from './ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card'
import { Form, FormField } from './ui/form'
import { Textarea } from './ui/textarea'

const formSchema = z.object({
  question: z.string(),
})

export function QuestionForm() {
  const form = useForm<PostRoomsByRoomIdQuestionsMutationRequest>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      question: '',
    },
  })

  function handleCreateQuestion() {
    return
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fazer uma Pergunta</CardTitle>
        <CardDescription>
          Digite sua pergunta abaixo para receber uma resposta gerada por IA
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-1">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleCreateQuestion)}>
            <p className="font-bold">Sua Pergunta</p>

            <FormField
              control={form.control}
              name="question"
              render={({ field }) => (
                <Textarea
                  placeholder="O que você gostaria de saber?"
                  {...field}
                />
              )}
            />

            <Button className="mt-2 w-full" type="submit">
              Enviar pergunta
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
