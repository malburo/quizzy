'use client'

import { TransitionPanel } from '@/components/core'
import type { ChoiceKey, Question } from '@/models'
import { QuizBubble, QuizMascot } from './quiz-mascot-row'
import { QuizChoices } from './quiz-choices'
import { QuizExplanation } from './quiz-explanation'
import { QuizEmptyQuestion } from './quiz-empty-question'

export function QuizQuestion({
  question,
  correctKey,
  currentId,
  body,
  mobileShowExplanation,
}: {
  question: Question
  correctKey: ChoiceKey | null
  currentId: number
  body: string | null
  mobileShowExplanation: boolean
}) {
  if (!question.stem) return <QuizEmptyQuestion />

  return (
    <div className="flex flex-col gap-7">
      {/* Mascot stays mounted across questions (Rive is heavy to re-init); only
          the bubble + answer block crossfade per question via TransitionPanel. */}
      <div className="flex items-center gap-3.5 md:gap-6">
        <QuizMascot correctKey={correctKey} />
        <TransitionPanel activeKey={currentId} className="min-w-0 flex-1">
          <QuizBubble stem={question.stem} />
        </TransitionPanel>
      </div>

      <TransitionPanel activeKey={currentId} className="flex flex-col gap-7">
        {body ? <div className="cq-md" dangerouslySetInnerHTML={{ __html: body }} /> : null}
        {question.choices && correctKey ? (
          <QuizChoices choices={question.choices} correctKey={correctKey} currentId={currentId} />
        ) : null}
        <QuizExplanation
          correctKey={correctKey}
          explanation={question.explanation ?? null}
          mobileShow={mobileShowExplanation}
        />
      </TransitionPanel>
    </div>
  )
}
