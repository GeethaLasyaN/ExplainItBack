# ExplainItBack

> Don't just answer. Prove that you understand.

ExplainItBack is an AI-powered learning tool that evaluates a student's understanding by asking them to explain a concept in their own words.

Instead of simply giving students answers, ExplainItBack checks what they actually understand, identifies knowledge gaps and misconceptions, and asks a targeted follow-up question to test deeper understanding.

## Live Demo

https://explain-it-back-ashy.vercel.app

## Problem

Students often memorize answers without truly understanding the underlying concept.

Traditional learning tools usually provide answers, explanations, or scores. They do not always verify whether the student can explain the concept independently.

ExplainItBack addresses this by making the student's explanation the starting point of the learning process.

## Solution

The student:

1. Enters a concept.
2. Explains the concept in their own words.
3. ExplainItBack evaluates their explanation using AI.
4. The system identifies:
   - What they understood correctly
   - Important concepts they missed
   - Possible misconceptions
   - A specific improvement suggestion
5. The AI asks a targeted follow-up question.
6. The student answers the question.
7. The system evaluates the follow-up answer and provides the next learning step.

##  Features

### AI Understanding Evaluation

Evaluates conceptual understanding instead of simply checking for keywords.

### Understanding Score

Provides a score from 0–100 based on the student's explanation.

### Strength Detection

Identifies concepts and ideas the student explained correctly.

### Knowledge Gap Detection

Highlights important concepts that are missing from the explanation.

### Misconception Detection

Identifies incorrect or misleading understanding when present.

### Personalized Improvement

Provides a specific suggestion for improving the student's understanding.

### Targeted Follow-Up

Generates a question focused on the student's weakest area.

### Follow-Up Evaluation

Evaluates the student's second response and provides feedback and a recommended next step.

### Interactive UI

The application includes an interactive 3D visual on the landing page and a focused AI learning interface.

## Technology Stack

### Frontend

- React
- Vite
- JavaScript
- CSS

### Backend

- Python
- FastAPI
- Uvicorn

### AI

- OpenAI API

### Deployment

- Vercel — Frontend
- Render — Backend

### Version Control

- Git
- GitHub

##  Architecture

```text
                    ┌─────────────────────┐
                    │       Student      │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   React Frontend    │
                    │       Vercel        │
                    └──────────┬──────────┘
                               │
                         HTTP Requests
                               │
                               ▼
                    ┌─────────────────────┐
                    │   FastAPI Backend   │
                    │       Render        │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │     OpenAI API      │
                    │ AI Evaluation Engine │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Evaluation Results  │
                    │ Score + Feedback    │
                    │ Gaps + Follow-up    │
                    └─────────────────────┘