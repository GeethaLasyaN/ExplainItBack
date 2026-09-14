import os
import json

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import OpenAI

load_dotenv()

app = FastAPI(title="ExplainItBack API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://explain-it-back-ashy.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


class EvaluationRequest(BaseModel):
    topic: str
    explanation: str


class FollowUpRequest(BaseModel):
    topic: str
    question: str
    answer: str


@app.get("/")
def home():
    return {
        "message": "ExplainItBack API is running!"
    }


@app.post("/evaluate")
def evaluate(request: EvaluationRequest):

    prompt = f"""
You are an expert educational evaluator.

Evaluate a student's understanding of the concept below.

CONCEPT:
{request.topic}

STUDENT'S EXPLANATION:
{request.explanation}

Return ONLY valid JSON using exactly this structure:

{{
  "score": 0,
  "correct": [
    "something the student understood correctly"
  ],
  "missed": [
    "important concept the student missed"
  ],
  "misconceptions": [
    "specific misconception, if any"
  ],
  "improvement": "one specific and useful suggestion",
  "follow_up": "one targeted question that tests the student's weakest area"
}}

Rules:
- score must be an integer from 0 to 100
- Be fair and educational
- Give credit for correct ideas
- Do not invent misconceptions
- Keep feedback specific
- If the explanation is very short, explain what important information is missing
- The follow-up question must directly relate to the concept
"""

    response = client.responses.create(
        model="gpt-5.6-luna",
        input=prompt
    )

    raw_output = response.output_text.strip()

    try:
        result = json.loads(raw_output)
    except json.JSONDecodeError:
        result = {
            "score": 0,
            "correct": [],
            "missed": [],
            "misconceptions": [],
            "improvement": raw_output,
            "follow_up": ""
        }

    return {
        "topic": request.topic,
        "evaluation": result
    }


@app.post("/follow-up")
def follow_up(request: FollowUpRequest):

    prompt = f"""
You are an expert educational evaluator.

The student is learning:

CONCEPT:
{request.topic}

FOLLOW-UP QUESTION:
{request.question}

STUDENT'S ANSWER:
{request.answer}

Evaluate the answer.

Return ONLY valid JSON using exactly this structure:

{{
  "score": 0,
  "correct": "what the student got right",
  "feedback": "clear and constructive feedback",
  "next_step": "what the student should understand or practise next"
}}

Rules:
- score must be from 0 to 100
- Be encouraging but honest
- Focus on conceptual understanding
- Do not give credit for an answer that is unrelated to the question
"""

    response = client.responses.create(
        model="gpt-5.6-luna",
        input=prompt
    )

    raw_output = response.output_text.strip()

    try:
        result = json.loads(raw_output)
    except json.JSONDecodeError:
        result = {
            "score": 0,
            "correct": "",
            "feedback": raw_output,
            "next_step": ""
        }

    return result