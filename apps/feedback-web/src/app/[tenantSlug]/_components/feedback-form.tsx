'use client';

import type {
  FeedbackTopic,
  PublicFeedbackSubmission,
} from '@yuta/contracts/reputation';
import { useMemo, useState, type FormEvent } from 'react';
import type { ExternalLinks, FlowStep } from '../_lib/feedback-types';
import { getResponseErrorMessage } from '../_lib/feedback-response';
import { FeedbackShell } from './feedback-shell';
import { WelcomeStep } from './feedback-welcome-step';
import { FlowHeader } from './feedback-flow-header';
import { RatingStep } from './feedback-rating-step';
import { TopicsStep } from './feedback-topics-step';
import { CommentStep } from './feedback-comment-step';
import { FeedbackSuccess } from './feedback-success';

type FeedbackFormProps = {
  tenantSlug: string;
  establishmentName: string;
  externalLinks: ExternalLinks;
};

const initialForm: PublicFeedbackSubmission = {
  rating: 0,
  topics: [],
  comment: '',
  customerName: '',
  customerEmail: '',
  customerPhone: '',
  consentToContact: false,
  orderReference: '',
  website: '',
};

const sourceTags = new Set([
  'table',
  'receipt',
  'counter',
  'click_collect',
  'email',
  'other',
]);

export function FeedbackForm({
  tenantSlug,
  establishmentName,
  externalLinks,
}: FeedbackFormProps) {
  const [form, setForm] = useState<PublicFeedbackSubmission>(initialForm);
  const [step, setStep] = useState<FlowStep>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const sourceTag = useMemo(() => {
    if (typeof window === 'undefined') return undefined;
    const value = new URLSearchParams(window.location.search).get('source');
    return value && sourceTags.has(value) ? value : undefined;
  }, []);

  function goToStep(nextStep: FlowStep) {
    setError(null);
    setStep(nextStep);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function continueFromRating() {
    if (form.rating < 1) {
      setError('Sélectionnez une note avant de continuer.');
      return;
    }
    goToStep(3);
  }

  function toggleTopic(topic: FeedbackTopic) {
    setForm((current) => ({
      ...current,
      topics: current.topics.includes(topic)
        ? current.topics.filter((item) => item !== topic)
        : [...current.topics, topic],
    }));
  }

  async function submitFeedback(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if ((form.customerEmail || form.customerPhone) && !form.consentToContact) {
      setError(
        'Acceptez le consentement pour nous permettre de vous recontacter.',
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/public/feedback/${tenantSlug}`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ ...form, sourceTag }),
      });
      const result: unknown = await response.json();
      const message = getResponseErrorMessage(result);
      if (!response.ok) {
        throw new Error(
          message ??
            "Votre message n'a pas pu être envoyé. Veuillez réessayer.",
        );
      }
      setIsSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (submissionError: unknown) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Votre message n'a pas pu être envoyé. Veuillez réessayer.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function resetFeedback() {
    setForm(initialForm);
    setStep(1);
    setIsSubmitted(false);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  if (isSubmitted) {
    return (
      <FeedbackSuccess
        establishmentName={establishmentName}
        externalLinks={externalLinks}
        onReset={resetFeedback}
      />
    );
  }

  return (
    <FeedbackShell>
      {step === 1 ? (
        <WelcomeStep
          establishmentName={establishmentName}
          onContinue={() => goToStep(2)}
        />
      ) : (
        <>
          <FlowHeader
            step={step}
            onBack={() => goToStep((step - 1) as FlowStep)}
          />
          {step === 2 && (
            <RatingStep
              rating={form.rating}
              error={error}
              onRatingChange={(rating) => {
                setError(null);
                setForm((current) => ({ ...current, rating }));
              }}
              onContinue={continueFromRating}
            />
          )}
          {step === 3 && (
            <TopicsStep
              selectedTopics={form.topics}
              onToggle={toggleTopic}
              onContinue={() => goToStep(4)}
            />
          )}
          {step === 4 && (
            <CommentStep
              form={form}
              establishmentName={establishmentName}
              error={error}
              isSubmitting={isSubmitting}
              onChange={setForm}
              onSubmit={submitFeedback}
            />
          )}
        </>
      )}
    </FeedbackShell>
  );
}

export { FeedbackSuccess };
