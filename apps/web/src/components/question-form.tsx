import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import z from 'zod'
import {
  type GetRoomQuestionsPathParams,
  type GetRoomQuestionsQueryResponse,
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

const formSchema = z.object({
  question: z.string().min(1, { error: 'A pergunta não pode estar em branco' }),
})

export function QuestionForm({ roomId }: GetRoomQuestionsPathParams) {
  const queryClient = useQueryClient()

  const { mutateAsync: createQuestion } = usePostRoomQuestion({
    mutation: {
      onMutate: ({ data }) => {
        const questions =
          queryClient.getQueryData<GetRoomQuestionsQueryResponse>(
            getRoomQuestionsQueryKey(roomId)
          )

        const questionsArray = questions ?? []

        const newQuestion = {
          id: crypto.randomUUID(),
          question: data.question,
          answer: null,
          createdAt: new Date().toISOString(),
        }

        queryClient.setQueryData<GetRoomQuestionsQueryResponse>(
          getRoomQuestionsQueryKey(roomId),
          [newQuestion, ...questionsArray]
        )

        return { newQuestion, questions }
      },

      onError: (_error, _variables, context) => {
        if (context?.questions) {
          queryClient.setQueryData<GetRoomQuestionsQueryResponse>(
            getRoomQuestionsQueryKey(roomId),
            context.questions
          )
        }
      },

      onSuccess: ({ questionId, answer }, _variables, { newQuestion }) => {
        queryClient.setQueryData<GetRoomQuestionsQueryResponse>(
          getRoomQuestionsQueryKey(roomId),
          (questions) => {
            if (!questions) {
              return questions
            }

            if (!newQuestion) {
              return questions
            }

            return questions.map((question) => {
              if (question.id === newQuestion.id) {
                return {
                  ...newQuestion,
                  id: questionId,
                  answer,
                }
              }

              return question
            })
          }
        )
      },
    },
  })

  const form = useForm<PostRoomQuestionMutationRequest>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      question: '',
    },
  })

  const { isSubmitting } = form.formState

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
                    disabled={isSubmitting}
                  />

                  <FormMessage />
                </>
              )}
            />

            <Button
              className="mt-2 w-full"
              disabled={isSubmitting}
              type="submit"
            >
              Enviar pergunta
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
