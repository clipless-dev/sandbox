'use client'

// An expense claim: the employee files it, the manager approves it or sends it
// back, finance pays it. api.clipless.dev gets this whole file (`bun run deploy`); each
// browser gets only its own role's stages, with no action settings.

import { Action, Field, Stage, Step, useWorkflowNav, useWorkflowState, Workflow, type WorkflowProps } from '@clipless/react'

/** Continue to the next step; on the last one, submit the stage. */
function Next() {
  const { steps, next, canGoNext } = useWorkflowNav()
  if (steps.length === 0) return <p>Nothing for you to do on this claim.</p>
  return (
    <button type="button" disabled={!canGoNext} onClick={next}>
      Continue
    </button>
  )
}

/** The claim, read-only, for the people reviewing it. */
function Claimed() {
  const { answers } = useWorkflowState()
  return (
    <p>
      {String(answers.description)}: ${String(answers.amount)}
    </p>
  )
}

export default function ExpenseClaim(props: Partial<WorkflowProps>) {
  return (
    <Workflow id="expense_claim_v1" version="1.0.0" {...props}>
      <Stage name="claim" actor="role:employee">
        <Step name="details">
          <Field name="description" type="string" label="What was it for?" required />
          <Field name="amount" type="number" label="Amount (USD)" required min={1} />
        </Step>
      </Stage>

      <Stage
        name="review"
        actor="role:manager"
        fresh
        transitions={[{ targetStageId: 'claim', condition: { decision: { eq: 'Send back' } } }]}
      >
        <Step name="decision">
          <Claimed />
          <Field
            name="decision"
            type="select"
            label="Decision"
            required
            options={[{ value: 'Approve' }, { value: 'Send back' }, { value: 'Reject' }]}
          />
        </Step>
        <Action id="notify_manager" type="email" on="enter" to="manager@example.com" subject="A claim to review" />
      </Stage>

      <Stage name="payout" actor="role:finance" renderIf={{ decision: { eq: 'Approve' } }}>
        <Step name="payment">
          <Claimed />
          <Field name="payment_ref" type="string" label="Payment reference" required />
        </Step>
        <Action id="paid" type="webhook" endpoint={process.env.CLIPLESS_WEBHOOK_URL} />
      </Stage>

      <Next />
    </Workflow>
  )
}
