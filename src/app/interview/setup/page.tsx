"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BriefcaseBusiness,
  Code2,
  BrainCircuit,
  Layers3,
  Monitor,
  Server,
  Sparkles,
  Users,
  Gauge,
  MessageSquareText,
  ChevronRight,
  Check,
} from "lucide-react";

import Sidebar from "@/components/Sidebar";
import DashboardHeader from "@/components/DashboardHeader";
import { createInterview, getCurrentUser } from "@/lib/api";

type User = {
  id: number;
  full_name: string;
  email: string;
};

const roles = [
  {
    name: "Software Engineer",
    description: "General software engineering concepts",
    icon: Code2,
  },
  {
    name: "Frontend Developer",
    description: "React, UI, JavaScript and frontend concepts",
    icon: Monitor,
  },
  {
    name: "Backend Developer",
    description: "APIs, databases and server-side development",
    icon: Server,
  },
  {
    name: "Full Stack Developer",
    description: "Frontend and backend engineering",
    icon: Layers3,
  },
  {
    name: "AI / ML Engineer",
    description: "Machine learning, AI and model development",
    icon: BrainCircuit,
  },
  {
    name: "Data Scientist",
    description: "Data analysis, statistics and ML concepts",
    icon: Sparkles,
  },
];

const interviewTypes = [
  {
    name: "Technical",
    description: "Technical knowledge and problem solving",
    icon: Code2,
  },
  {
    name: "Behavioral",
    description: "Communication and workplace scenarios",
    icon: Users,
  },
  {
    name: "Mixed",
    description: "Combination of technical and behavioral",
    icon: MessageSquareText,
  },
];

const difficulties = ["Easy", "Medium", "Hard"];

const experienceLevels = [
  "Intern",
  "Entry Level",
  "Junior",
  "Mid-Level",
];

const questionCounts = [5, 10, 15];

export default function InterviewSetupPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const [selectedRole, setSelectedRole] = useState("Software Engineer");
  const [interviewType, setInterviewType] = useState("Technical");
  const [difficulty, setDifficulty] = useState("Medium");
  const [experienceLevel, setExperienceLevel] = useState("Intern");
  const [questionCount, setQuestionCount] = useState(5);

  const [startingInterview, setStartingInterview] = useState(false);
const [startError, setStartError] = useState("");

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("access_token");

      if (!token) {
        router.replace("/login");
        return;
      }

      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error("Failed to load user:", error);
        localStorage.removeItem("access_token");
        router.replace("/login");
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    router.push("/login");
  };

  const handleStartInterview = async () => {
  try {
    setStartingInterview(true);
    setStartError("");

    const interview = await createInterview({
      target_role: selectedRole,
      interview_type: interviewType,
      difficulty,
      experience_level: experienceLevel,
      question_count: questionCount,
    });

    sessionStorage.setItem(
      "interview_configuration",
      JSON.stringify({
        interviewId: interview.id,
        role: interview.target_role,
        interviewType: interview.interview_type,
        difficulty: interview.difficulty,
        experienceLevel: interview.experience_level,
        questionCount: interview.question_count,
        status: interview.status,
      })
    );

    console.log("Created interview:", interview);

    router.push(`/interview/session?id=${interview.id}`);
  } catch (error) {
    console.error("Failed to start interview:", error);

    setStartError(
      error instanceof Error
        ? error.message
        : "Failed to start interview"
    );
  } finally {
    setStartingInterview(false);
  }
};

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <BrainCircuit className="mx-auto mb-3 h-9 w-9 animate-pulse text-violet-600" />
          <p className="text-sm text-slate-500">
            Preparing your interview workspace...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <main
  style={{
    minHeight: "100vh",
    background: "#f8fafc",
    display: "flex",
  }}
>
  <Sidebar
    user={user}
    onLogout={handleLogout}
  />

  <div
    style={{
      flex: 1,
      minWidth: 0,
    }}
  >

      <DashboardHeader
  user={user}
  title="Interview Setup"
  subtitle="Configure your personalized AI mock interview"
/>

        <div className="mx-auto max-w-7xl p-5 md:p-8">
          {/* Heading */}
          <section className="mb-8">
            <p className="mb-2 text-sm font-semibold text-violet-600">
              AI-POWERED MOCK INTERVIEW
            </p>

            <h1 className="text-3xl font-bold tracking-tight">
              Customize your interview
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Choose your target role, interview style and difficulty. InterviewAI
              will use these preferences to create a personalized interview
              experience.
            </p>
          </section>

          <div className="grid gap-7 xl:grid-cols-[1fr_340px]">
            {/* LEFT SIDE */}
            <div className="space-y-7">
              {/* ROLE */}
              <SetupSection
                number="01"
                title="Choose your target role"
                description="Select the position you want to prepare for."
              >
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {roles.map((role) => {
                    const Icon = role.icon;
                    const active = selectedRole === role.name;

                    return (
                      <button
                        key={role.name}
                        type="button"
                        onClick={() => setSelectedRole(role.name)}
                        className={`relative rounded-2xl border p-4 text-left transition-all ${
                          active
                            ? "border-violet-500 bg-violet-50 shadow-sm"
                            : "border-slate-200 bg-white hover:border-violet-300 hover:shadow-sm"
                        }`}
                      >
                        {active && (
                          <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-violet-600 text-white">
                            <Check className="h-3 w-3" />
                          </span>
                        )}

                        <div
                          className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl ${
                            active
                              ? "bg-violet-600 text-white"
                              : "bg-violet-50 text-violet-600"
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                        </div>

                        <h3 className="font-semibold">{role.name}</h3>

                        <p className="mt-1 text-xs leading-5 text-slate-500">
                          {role.description}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </SetupSection>

              {/* INTERVIEW TYPE */}
              <SetupSection
                number="02"
                title="Interview type"
                description="Choose the style of interview you want to practice."
              >
                <div className="grid gap-3 md:grid-cols-3">
                  {interviewTypes.map((type) => {
                    const Icon = type.icon;
                    const active = interviewType === type.name;

                    return (
                      <button
                        type="button"
                        key={type.name}
                        onClick={() => setInterviewType(type.name)}
                        className={`rounded-2xl border p-5 text-left transition-all ${
                          active
                            ? "border-violet-500 bg-violet-50"
                            : "border-slate-200 bg-white hover:border-violet-300"
                        }`}
                      >
                        <Icon
                          className={`mb-4 h-6 w-6 ${
                            active ? "text-violet-600" : "text-slate-500"
                          }`}
                        />

                        <h3 className="font-semibold">{type.name}</h3>

                        <p className="mt-1 text-xs leading-5 text-slate-500">
                          {type.description}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </SetupSection>

              {/* DIFFICULTY */}
              <SetupSection
                number="03"
                title="Difficulty level"
                description="Select how challenging you want your interview to be."
              >
                <div className="grid grid-cols-3 gap-3">
                  {difficulties.map((item) => (
                    <button
                      type="button"
                      key={item}
                      onClick={() => setDifficulty(item)}
                      className={`rounded-xl border px-4 py-4 text-sm font-semibold transition ${
                        difficulty === item
                          ? "border-violet-500 bg-violet-600 text-white"
                          : "border-slate-200 bg-white text-slate-600 hover:border-violet-300"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </SetupSection>

              {/* EXPERIENCE */}
              <SetupSection
                number="04"
                title="Experience level"
                description="This helps InterviewAI adjust question depth."
              >
                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                  {experienceLevels.map((level) => (
                    <button
                      type="button"
                      key={level}
                      onClick={() => setExperienceLevel(level)}
                      className={`rounded-xl border px-3 py-4 text-sm font-medium transition ${
                        experienceLevel === level
                          ? "border-violet-500 bg-violet-50 text-violet-700"
                          : "border-slate-200 bg-white text-slate-600 hover:border-violet-300"
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </SetupSection>

              {/* QUESTIONS */}
              <SetupSection
                number="05"
                title="Number of questions"
                description="Choose the length of your mock interview."
              >
                <div className="grid grid-cols-3 gap-3">
                  {questionCounts.map((count) => (
                    <button
                      type="button"
                      key={count}
                      onClick={() => setQuestionCount(count)}
                      className={`rounded-xl border px-4 py-4 transition ${
                        questionCount === count
                          ? "border-violet-500 bg-violet-50 text-violet-700"
                          : "border-slate-200 bg-white text-slate-600 hover:border-violet-300"
                      }`}
                    >
                      <span className="block text-lg font-bold">{count}</span>
                      <span className="text-xs">Questions</span>
                    </button>
                  ))}
                </div>
              </SetupSection>
            </div>

            {/* SUMMARY */}
            <aside className="h-fit xl:sticky xl:top-28">
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 p-6">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
                    <BriefcaseBusiness className="h-5 w-5" />
                  </div>

                  <h2 className="text-lg font-bold">Interview Summary</h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Review your configuration before starting.
                  </p>
                </div>

                <div className="space-y-5 p-6">
                  <SummaryItem label="Target role" value={selectedRole} />
                  <SummaryItem label="Interview type" value={interviewType} />
                  <SummaryItem label="Difficulty" value={difficulty} />
                  <SummaryItem
                    label="Experience"
                    value={experienceLevel}
                  />
                  <SummaryItem
                    label="Questions"
                    value={`${questionCount} questions`}
                  />

                  <div className="rounded-xl bg-violet-50 p-4">
                    <div className="flex gap-3">
                      <Gauge className="mt-0.5 h-5 w-5 shrink-0 text-violet-600" />

                      <div>
                        <p className="text-sm font-semibold text-slate-800">
                          Personalized by AI
                        </p>

                        <p className="mt-1 text-xs leading-5 text-slate-500">
                          Questions will be generated based on your selected
                          role, level and interview preferences.
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
  type="button"
  onClick={handleStartInterview}
  disabled={startingInterview}
  className="flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-violet-600 to-purple-600 px-5 py-4 text-sm font-semibold text-white shadow-sm transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
>
  {startingInterview ? "Starting Interview..." : "Start AI Interview"}

  {!startingInterview && (
    <ChevronRight className="h-4 w-4" />
  )}
</button>

{startError && (
  <p className="text-center text-sm font-medium text-red-600">
    {startError}
  </p>
)}

                  <button
                    type="button"
                    onClick={() => router.push("/")}
                    className="w-full rounded-xl px-5 py-3 text-sm font-medium text-slate-500 transition hover:bg-slate-50 hover:text-slate-800"
                  >
                    Back to Dashboard
                  </button>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </main>
  );
}

function SetupSection({
  number,
  title,
  description,
  children,
}: {
  number: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
      <div className="mb-5 flex gap-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-xs font-bold text-violet-600">
          {number}
        </div>

        <div>
          <h2 className="font-bold text-slate-900">{title}</h2>
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        </div>
      </div>

      {children}
    </section>
  );
}

function SummaryItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="text-right text-sm font-semibold text-slate-800">
        {value}
      </span>
    </div>
  );
}