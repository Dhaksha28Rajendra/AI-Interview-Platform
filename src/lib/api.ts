const API_BASE_URL = "http://127.0.0.1:8000";

export interface LoginData {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export async function loginUser(
  data: LoginData
): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);

    throw new Error(
      error?.detail || "Login failed"
    );
  }

  return response.json();
}

export async function getCurrentUser() {
  const token = localStorage.getItem("access_token");

  if (!token) {
    throw new Error("No access token found");
  }

  const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);

    throw new Error(
      error?.detail || "Failed to get current user"
    );
  }

  return response.json();
}

export async function registerUser(data: {
  email: string;
  password: string;
  full_name: string;
}) {
  const response = await fetch(`${API_BASE_URL}/api/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);

    throw new Error(
      error?.detail || "Registration failed"
    );
  }

  return response.json();
}

export interface CreateInterviewData {
  target_role: string;
  interview_type: string;
  difficulty: string;
  experience_level: string;
  question_count: number;
}

export interface InterviewQuestion {
  id: number;
  question: string;
}

export interface InterviewAnswer {
  question_id: number;
  question: string;
  answer: string;
}

export async function getInterviewQuestions(
  interviewId: number
): Promise<InterviewQuestion[]> {
  const token = localStorage.getItem("access_token");

  if (!token) {
    throw new Error("No access token found");
  }

  const response = await fetch(
    `${API_BASE_URL}/api/interviews/${interviewId}/questions`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => null);

    throw new Error(
      error?.detail || "Failed to get interview questions"
    );
  }

  return response.json();
}


export async function evaluateInterview(
  interviewId: number,
  answers: InterviewAnswer[]
) {
  const token = localStorage.getItem("access_token");

  if (!token) {
    throw new Error("No access token found");
  }

  const response = await fetch(
    `${API_BASE_URL}/api/interviews/${interviewId}/evaluate`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        answers: answers,
      }),
    }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => null);

    throw new Error(
      error?.detail || "Failed to evaluate interview"
    );
  }

  return response.json();
}

export interface InterviewResponse {
  id: number;
  user_id: number;
  target_role: string;
  interview_type: string;
  difficulty: string;
  experience_level: string;
  question_count: number;
  status: string;
  created_at: string;
}

export async function createInterview(
  data: CreateInterviewData
): Promise<InterviewResponse> {
  const token = localStorage.getItem("access_token");

  if (!token) {
    throw new Error("No access token found");
  }

  const response = await fetch(`${API_BASE_URL}/api/interviews`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);

    throw new Error(
      error?.detail || "Failed to create interview"
    );
  }

  return response.json();
}