"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type InterviewConfiguration = {
  interviewId: number;
  role: string;
  interviewType: string;
  difficulty: string;
  experienceLevel: string;
  questionCount: number;
  status: string;
};

type InterviewQuestion = {
  id: number;
  text: string;
};

type InterviewAnswer = {
  questionId: number;
  question: string;
  answer: string;
};

export default function InterviewSessionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const interviewId = searchParams.get("id");

  /*
   * Read the interview configuration from sessionStorage.
   * useMemo is used here so we do not need to call setState
   * synchronously inside a useEffect.
   */
  const configuration = useMemo<InterviewConfiguration | null>(() => {
    if (typeof window === "undefined") {
      return null;
    }

    const stored = window.sessionStorage.getItem(
      "interview_configuration"
    );

    if (!stored) {
      return null;
    }

    try {
      return JSON.parse(stored) as InterviewConfiguration;
    } catch {
      return null;
    }
  }, []);

  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [loading, setLoading] = useState(true);

  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [answer, setAnswer] = useState("");

  const [answers, setAnswers] = useState<InterviewAnswer[]>([]);

  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  /*
   * Load interview questions from the backend.
   */
  useEffect(() => {
    if (!interviewId) {
      return;
    }

    const token = localStorage.getItem("access_token");

    if (!token) {
      console.error("No access token found.");
      return;
    }

    fetch(
      `http://127.0.0.1:8000/api/interviews/${interviewId}/questions`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then(async (res) => {
        if (!res.ok) {
          throw new Error("Failed to load interview questions");
        }

        return res.json();
      })
      .then((data) => {
        setQuestions(data.questions || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to load questions:", error);
        setLoading(false);
      });
  }, [interviewId]);

  /*
   * Interview timer.
   */
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds((previous) => previous + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  /*
   * Number of questions.
   */
  const totalQuestions =
    questions.length > 0
      ? questions.length
      : configuration?.questionCount ?? 5;

  /*
   * Progress percentage.
   */
  const progress = useMemo(() => {
    if (totalQuestions === 0) {
      return 0;
    }

    return (currentQuestion / totalQuestions) * 100;
  }, [currentQuestion, totalQuestions]);

  /*
   * Current question.
   */
  const currentQuestionData =
    questions[currentQuestion - 1];

  const currentQuestionText =
    currentQuestionData?.text || "Loading question...";

  /*
   * Format timer.
   */
  const formattedTime = useMemo(() => {
    const minutes = Math.floor(elapsedSeconds / 60)
      .toString()
      .padStart(2, "0");

    const seconds = (elapsedSeconds % 60)
      .toString()
      .padStart(2, "0");

    return `${minutes}:${seconds}`;
  }, [elapsedSeconds]);

  /*
   * Save the current answer into the local answers array.
   */
  const saveCurrentAnswer = () => {
    if (!currentQuestionData) {
      return;
    }

    const newAnswer: InterviewAnswer = {
      questionId: currentQuestionData.id,
      question: currentQuestionData.text,
      answer: answer.trim(),
    };

    setAnswers((previousAnswers) => {
      const existingIndex = previousAnswers.findIndex(
        (item) => item.questionId === newAnswer.questionId
      );

      if (existingIndex !== -1) {
        const updatedAnswers = [...previousAnswers];
        updatedAnswers[existingIndex] = newAnswer;
        return updatedAnswers;
      }

      return [...previousAnswers, newAnswer];
    });

    return newAnswer;
  };

  /*
   * Save all answers into sessionStorage.
   *
   * This is temporary persistence for the interview flow.
   * We will connect this to the backend in the next stage.
   */
  const saveAnswersToSession = (
    latestAnswer?: InterviewAnswer
  ) => {
    if (!interviewId) {
      return;
    }

    const finalAnswers = [...answers];

    if (latestAnswer) {
      const existingIndex = finalAnswers.findIndex(
        (item) => item.questionId === latestAnswer.questionId
      );

      if (existingIndex !== -1) {
        finalAnswers[existingIndex] = latestAnswer;
      } else {
        finalAnswers.push(latestAnswer);
      }
    }

    sessionStorage.setItem(
      `interview_answers_${interviewId}`,
      JSON.stringify(finalAnswers)
    );
  };

  /*
   * Move to the next question.
   */
  const nextQuestion = () => {
    if (!currentQuestionData) {
      return;
    }

    const latestAnswer = saveCurrentAnswer();

    /*
     * Because React state updates are asynchronous,
     * explicitly include the current answer when saving.
     */
    if (latestAnswer) {
      saveAnswersToSession(latestAnswer);
    }

    if (currentQuestion < totalQuestions) {
      setCurrentQuestion((previous) => previous + 1);

      /*
       * Clear the textarea for the next question.
       */
      setAnswer("");
    } else {
      /*
       * Last question.
       * Navigate to the results page.
       */
      saveAnswersToSession(latestAnswer);

      router.push(
        `/interview/results?id=${interviewId}`
      );
    }
  };

  /*
   * End interview without completing all questions.
   */
  const endInterview = () => {
    const confirmed = window.confirm(
      "Are you sure you want to end the interview?"
    );

    if (!confirmed) {
      return;
    }

    if (currentQuestionData) {
      const latestAnswer = saveCurrentAnswer();

      if (latestAnswer) {
        saveAnswersToSession(latestAnswer);
      }
    }

    router.push(
      `/interview/results?id=${interviewId}`
    );
  };

  /*
   * Loading screen.
   */
  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-violet-600" />

          <p className="text-lg font-medium text-slate-700">
            Loading interview...
          </p>
        </div>
      </main>
    );
  }

  /*
   * No questions found.
   */
  if (!loading && questions.length === 0) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
        <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">
            Unable to load interview
          </h1>

          <p className="mt-3 text-slate-500">
            We could not find any questions for this interview.
          </p>

          <button
            type="button"
            onClick={() => router.push("/interview/setup")}
            className="mt-6 rounded-2xl bg-violet-600 px-6 py-3 font-semibold text-white transition hover:bg-violet-700"
          >
            Back to setup
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <div className="mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">

        {/* Header */}
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-violet-600">
              AI Technical Interview
            </p>

            <h1 className="mt-2 text-3xl font-bold text-slate-900">
              {configuration?.role ?? "Interview Session"}
            </h1>

            <p className="mt-2 text-slate-500">
              Interview ID: {interviewId ?? "N/A"}
            </p>
          </div>

          {/* Timer */}
          <div className="rounded-xl border border-slate-200 px-4 py-3 text-right">
            <p className="text-sm text-slate-500">
              Time elapsed
            </p>

            <p className="text-3xl font-bold text-slate-900">
              {formattedTime}
            </p>
          </div>
        </div>

        {/* Progress */}
        <div className="mt-8">
          <div className="mb-2 flex items-center justify-between">
            <p className="font-medium text-slate-900">
              Question {currentQuestion} of {totalQuestions}
            </p>

            <p className="text-sm text-slate-500">
              {Math.round(progress)}% complete
            </p>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-violet-600 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Current Question */}
        <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-violet-600">
            Current question
          </p>

          <h2 className="mt-4 text-3xl font-bold leading-relaxed text-slate-900">
            {currentQuestionText}
          </h2>
        </div>

        {/* Answer */}
        <div className="mt-8">
          <label className="mb-3 block text-sm font-medium text-slate-700">
            Your answer
          </label>

          <textarea
            value={answer}
            onChange={(event) => setAnswer(event.target.value)}
            placeholder="Type your answer here..."
            className="min-h-55 w-full rounded-2xl border border-slate-300 p-5 text-base text-slate-900 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
          />
        </div>

        {/* Buttons */}
        <div className="mt-8 flex items-center justify-between">
          <button
            type="button"
            onClick={endInterview}
            disabled={false}
            className="rounded-2xl border border-slate-300 px-6 py-3 font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            End interview
          </button>

          <button
  type="button"
  onClick={nextQuestion}
  className="rounded-2xl bg-violet-600 px-6 py-3 font-semibold text-white transition hover:bg-violet-700"
>
  {currentQuestion === totalQuestions
    ? "Finish interview"
    : "Next question"}
</button>
        </div>
      </div>
    </main>
  );
}