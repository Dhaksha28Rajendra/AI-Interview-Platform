"use client";

import { useEffect, useState } from "react";
import {
  BrainCircuit,
  MessageSquareText,
  ChevronRight,
  Play,
  Clock3,
  Target,
  TrendingUp,
  Sparkles,
} from "lucide-react";

import { getCurrentUser } from "@/lib/api";
import Sidebar from "@/components/Sidebar";
import DashboardHeader from "@/components/DashboardHeader";

type User = {
  id: number;
  email: string;
  full_name: string;
};

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState("Checking authentication...");

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      window.location.href = "/login";
      return;
    }

    const loadUser = async () => {
      try {
        const currentUser = await getCurrentUser();

        setUser(currentUser);
        setStatus("Authentication successful!");
      } catch (error) {
        console.error(error);

        localStorage.removeItem("access_token");
        window.location.href = "/login";
      }
    };

    loadUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    window.location.href = "/login";
  };

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-violet-600 text-white shadow-lg shadow-violet-200">
            <BrainCircuit className="h-7 w-7 animate-pulse" />
          </div>

          <p className="text-sm text-slate-500">{status}</p>
        </div>
      </main>
    );
  }

  const firstName = user.full_name.split(" ")[0];

  return (
  <main
    className="min-h-screen bg-slate-50 text-slate-900"
    style={{ display: "flex" }}
  >
    <Sidebar
  user={user}
  onLogout={handleLogout}
/>

<div style={{ flex: 1, minWidth: 0 }}>
  <DashboardHeader
    user={user}
    title="Dashboard"
    subtitle="Your interview preparation workspace"
  />

        <div className="mx-auto max-w-7xl p-5 md:p-8">
          {/* Welcome */}
          <section className="mb-8">
            <p className="mb-2 text-sm font-medium text-violet-600">
              Welcome back, {firstName}
            </p>

            <h2 className="text-3xl font-bold tracking-tight text-slate-950">
              Ready for your next interview?
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Practice with AI-powered interviews, receive personalized
              feedback, and track your progress over time.
            </p>
          </section>

          {/* Hero */}
          <section className="relative mb-8 overflow-hidden rounded-3xl bg-linear-to-br from-violet-600 via-purple-600 to-indigo-700 p-7 text-white shadow-xl shadow-violet-100 md:p-9">
            <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute bottom-0 right-40 h-32 w-32 rounded-full bg-purple-300/10 blur-2xl" />

            <div className="relative z-10 max-w-2xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium">
                <Sparkles className="h-4 w-4" />
                AI-Powered Mock Interview
              </div>

              <h3 className="text-2xl font-bold md:text-3xl">
                Start a new interview
              </h3>

              <p className="mt-3 max-w-xl text-sm leading-6 text-violet-100">
                Choose your target role, interview type, and difficulty level.
                InterviewAI will create a personalized interview experience for
                you.
              </p>

              <button
                onClick={() => {
                  window.location.href = "/interview/setup";
                }}
                className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-violet-700 shadow-sm transition hover:bg-violet-50"
              >
                <Play className="h-4 w-4 fill-current" />
                Start Interview
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </section>

          {/* Progress */}
          <section className="mb-8">
            <div className="mb-4">
              <h3 className="text-lg font-bold text-slate-900">
                Your Progress
              </h3>

              <p className="mt-1 text-sm text-slate-400">
                Your interview performance at a glance
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard
                icon={<MessageSquareText className="h-5 w-5" />}
                title="Total Interviews"
                value="0"
                description="Completed sessions"
              />

              <StatCard
                icon={<Target className="h-5 w-5" />}
                title="Average Score"
                value="--"
                description="No score available yet"
              />

              <StatCard
                icon={<Clock3 className="h-5 w-5" />}
                title="Practice Time"
                value="0m"
                description="Total preparation time"
              />

              <StatCard
                icon={<TrendingUp className="h-5 w-5" />}
                title="Improvement"
                value="--"
                description="Complete interviews to track"
              />
            </div>
          </section>

          {/* Lower section */}
          <section className="grid gap-6 xl:grid-cols-3">
            {/* Recent Interviews */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900">
                    Recent Interviews
                  </h3>

                  <p className="mt-1 text-sm text-slate-400">
                    Your latest interview sessions
                  </p>
                </div>

                <button className="text-sm font-semibold text-violet-600 hover:text-violet-700">
                  View all
                </button>
              </div>

              <div className="flex min-h-52 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 text-center">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
                  <MessageSquareText className="h-6 w-6" />
                </div>

                <h4 className="font-semibold text-slate-800">
                  No interviews yet
                </h4>

                <p className="mt-2 max-w-sm text-sm leading-6 text-slate-400">
                  Complete your first AI-powered mock interview and your
                  interview history will appear here.
                </p>
              </div>
            </div>

            {/* Preparation Tip */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
                <BrainCircuit className="h-6 w-6" />
              </div>

              <h3 className="text-lg font-bold text-slate-900">
                Preparation Tip
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                Consistent practice helps improve both technical communication
                and problem-solving confidence.
              </p>

              <div className="mt-6 rounded-xl bg-violet-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-violet-600">
                  Recommended
                </p>

                <p className="mt-2 text-sm font-medium leading-6 text-slate-700">
                  Start with a general software engineering interview to
                  establish your baseline.
                </p>
              </div>

              <button
                onClick={() => {
                  window.location.href = "/interview/setup";
                }}
                className="mt-5 flex items-center gap-1 text-sm font-semibold text-violet-600 hover:text-violet-700"
              >
                Start practicing
                <ChevronRight className="h-4 w-4" />
              </button>
                        </div>
          </section>
        </div>
      </div>
    </main>
  );
}

function StatCard({
  icon,
  title,
  value,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
          {icon}
        </div>
      </div>

      <p className="text-sm font-medium text-slate-500">{title}</p>

      <p className="mt-1 text-2xl font-bold tracking-tight text-slate-950">
        {value}
      </p>

      <p className="mt-2 text-xs text-slate-400">{description}</p>
    </div>
  );
}