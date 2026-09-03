"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { evaluateInterview } from "@/lib/api";

type InterviewAnswer = {
  questionId: number;
  question: string;
  answer: string;
};

export default function InterviewResultsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const interviewId = searchParams.get("id");

  const [evaluation, setEvaluation] = useState<unknown>(null);
const [isEvaluating, setIsEvaluating] = useState(false);
const [evaluationError, setEvaluationError] = useState<string | null>(null);

  const answers = useMemo<InterviewAnswer[]>(() => {
    if (typeof window === "undefined" || !interviewId) {
      return [];
    }

    const stored = window.sessionStorage.getItem(
      `interview_answers_${interviewId}`
    );

    if (!stored) {
      return [];
    }

    try {
      return JSON.parse(stored) as InterviewAnswer[];
    } catch {
      return [];
    }
  }, [interviewId]);

  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <div className="mx-auto max-w-4xl">

        {/* Header */}
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wide text-violet-600">
            AI Technical Interview
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Interview Completed
          </h1>

          <p className="mt-3 text-slate-500">
            Interview ID: {interviewId ?? "N/A"}
          </p>

          <div className="mt-6 rounded-xl bg-violet-50 p-5">
            <p className="font-medium text-violet-900">
              Your interview has been successfully completed.
            </p>

            <p className="mt-1 text-sm text-violet-700">
              Your answers have been recorded for this interview.
            </p>
          </div>
        </div>

        {/* Answers */}
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">
              Your Answers
            </h2>

            <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600">
              {answers.length} answer
              {answers.length !== 1 ? "s" : ""}
            </span>
          </div>

          {answers.length === 0 ? (
            <div className="mt-6 rounded-xl border border-dashed border-slate-300 p-6 text-center">
              <p className="text-slate-500">
                No answers were recorded.
              </p>
            </div>
          ) : (
            <div className="mt-6 space-y-6">
              {answers
                .sort(
                  (a, b) => a.questionId - b.questionId
                )
                .map((item, index) => (
                  <div
                    key={item.questionId}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-6"
                  >
                    <p className="text-sm font-semibold uppercase tracking-wide text-violet-600">
                      Question {index + 1}
                    </p>

                    <h3 className="mt-3 text-lg font-semibold leading-relaxed text-slate-900">
                      {item.question}
                    </h3>

                    <div className="mt-5 rounded-xl border border-slate-200 bg-white p-5">
                      <p className="text-sm font-medium text-slate-500">
                        Your answer
                      </p>

                      <p className="mt-2 whitespace-pre-wrap leading-relaxed text-slate-700">
                        {item.answer || "No answer provided."}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* AI Evaluation placeholder */}
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wide text-violet-600">
            AI Evaluation
          </p>

          <h2 className="mt-2 text-2xl font-bold text-slate-900">
            AI evaluation coming next
          </h2>

          <p className="mt-3 leading-relaxed text-slate-600">
            The next stage will analyze your answers using AI and
            generate your technical score, problem-solving score,
            communication feedback, strengths, weaknesses, and
            personalized improvement recommendations.
          </p>
        </div>

        {/* Actions */}
        <div className="mt-6 flex justify-between">
          <button
            type="button"
            onClick={() => router.push("/interview/setup")}
            className="rounded-2xl border border-slate-300 px-6 py-3 font-medium text-slate-700 transition hover:bg-slate-100"
          >
            Start another interview
          </button>

          <button
            type="button"
            onClick={() => router.push("/")}
            className="rounded-2xl bg-violet-600 px-6 py-3 font-semibold text-white transition hover:bg-violet-700"
          >
            Back to dashboard
          </button>
        </div>
      </div>
    </main>
  );
}