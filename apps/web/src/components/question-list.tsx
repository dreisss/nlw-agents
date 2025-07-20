import { type GetRoomQuestionsPathParams, useGetRoomQuestions } from '@/kubb'
import { QuestionItem } from './question-item'

export function QuestionList(props: GetRoomQuestionsPathParams) {
  const { data } = useGetRoomQuestions(props.roomId)

  return (
    <div className="mt-8 space-y-6">
      <h2 className="font-bold text-2xl">Perguntas & Respostas</h2>

      {data?.map((question) => (
        <QuestionItem key={question.id} question={question} />
      ))}
    </div>
  )
}
