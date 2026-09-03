import json
from openai import OpenAI

from app.core.config import settings


def evaluate_interview(
    target_role: str,
    interview_type: str,
    difficulty: str,
    experience_level: str,
    questions_and_answers: list[dict],
) -> dict:

    if not settings.OPENAI_API_KEY:
        raise ValueError("OPENAI_API_KEY is not configured")

    client = OpenAI(api_key=settings.OPENAI_API_KEY)

    formatted_answers = "\n\n".join(
        [
            f"""
Question {index + 1}:
{item["question"]}

Candidate Answer:
{item["answer"]}
"""
            for index, item in enumerate(questions_and_answers)
        ]
    )

    prompt = f"""
You are an expert technical interviewer evaluating a candidate
after a software engineering interview.

Interview information:
- Target role: {target_role}
- Interview type: {interview_type}
- Difficulty: {difficulty}
- Experience level: {experience_level}

Evaluate the candidate based ONLY on the questions and answers
provided below.

{formatted_answers}

Evaluate the candidate on:

1. Technical knowledge
2. Problem-solving ability
3. Communication
4. Answer quality
5. Overall interview performance

Give scores from 0 to 100.

Also provide:
- A concise overall summary
- 3 to 5 strengths
- 3 to 5 weaknesses or areas for improvement
- Question-by-question feedback
- A personalized improvement plan

Be fair and realistic.
Do not assume knowledge that the candidate did not demonstrate.

Return ONLY valid JSON in exactly this structure:

{{
  "overall_score": 0,
  "technical_score": 0,
  "problem_solving_score": 0,
  "communication_score": 0,
  "answer_quality_score": 0,

  "overall_feedback": "",

  "strengths": [
    ""
  ],

  "weaknesses": [
    ""
  ],

  "question_feedback": [
    {{
      "question_id": 1,
      "score": 0,
      "feedback": "",
      "improvement": ""
    }}
  ],

  "improvement_plan": [
    ""
  ]
}}
"""

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        temperature=0.2,
        response_format={"type": "json_object"},
        messages=[
            {
                "role": "system",
                "content": (
                    "You are a professional software engineering "
                    "interview evaluator. Return only valid JSON."
                ),
            },
            {
                "role": "user",
                "content": prompt,
            },
        ],
    )

    content = response.choices[0].message.content

    if not content:
        raise ValueError("AI returned an empty response")

    try:
        return json.loads(content)
    except json.JSONDecodeError as error:
        raise ValueError(
            "AI returned invalid JSON"
        ) from error