import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import z from 'zod'
import {
  type GetRoomQuestionsPathParams,
  getRoomQuestionsQueryKey,
  type PostRoomQuestionMutationRequest,
  usePostRoomQuestion,
} from '@/kubb'
import { Button } from './ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card'
import { Form, FormField, FormMessage } from './ui/form'
import { Textarea } from './ui/textarea'
import { useQueryClient } from '@tanstack/react-query'

const formSchema = z.object({
  question: z.string().min(1, { error: 'A pergunta não pode estar em branco' }),
})

export function QuestionForm({ roomId }: GetRoomQuestionsPathParams) {
  const queryClient = useQueryClient()

  const { mutateAsync: createQuestion, isSuccess } = usePostRoomQuestion()

  if (isSuccess) {
    queryClient.invalidateQueries({
      queryKey: getRoomQuestionsQueryKey(roomId),
    })
  }

  const form = useForm<PostRoomQuestionMutationRequest>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      question: '',
    },
  })

  function handleCreateQuestion(data: PostRoomQuestionMutationRequest) {
    createQuestion({ roomId, data })

    form.reset()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fazer uma Pergunta</CardTitle>
        <CardDescription>
          Digite sua pergunta abaixo para receber uma resposta gerada por IA
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form
            className="space-y-1"
            onSubmit={form.handleSubmit(handleCreateQuestion)}
          >
            <p className="font-bold">Sua Pergunta</p>

            <FormField
              control={form.control}
              name="question"
              render={({ field }) => (
                <>
                  <Textarea
                    placeholder="O que você gostaria de saber?"
                    {...field}
                  />

                  <FormMessage />
                </>
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
