# CodeBuddy

CodeBuddy is an AI-powered coding companion built with Next.js. It supports two workflows in one app:
- Code review with structured issues, explanations, and refactored output.
- Code translation between popular programming languages.

## Features

- Two modes in the same UI: `Code Review` and `Code Translator`.
- Syntax-highlighted code editor for input and output.
- Review results with severity, line references, summary, and suggested refactor.
- Translation flow that returns raw translated code.
- Responsive layout with light/dark theme support.
- Client-provided OpenAI API key stored in browser local storage.

## Tech Stack

- Next.js 16 (App Router)
- React 19 + TypeScript
- Tailwind CSS 4
- OpenAI SDK (`gpt-4o`)
- Framer Motion
- PrismJS + prism-react-renderer

## Requirements

- Node.js 20+
- npm

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Usage

1. Enter your OpenAI API key in the top input.
2. Choose `Code Review` or `Code Translator`.
3. Paste code and select language(s).
4. Run the action and review the generated output.

The API key is saved in local storage under `openai_api_key`.

## API Routes

### `POST /api/review`

Request body:

```json
{
  "code": "string",
  "language": "javascript",
  "apiKey": "sk-..."
}
```

Response shape:

```json
{
  "issues": [{ "line": 1, "message": "string", "severity": "low" }],
  "refactoredCode": "string",
  "explanation": "string"
}
```

### `POST /api/translate`

Request body:

```json
{
  "code": "string",
  "sourceLanguage": "javascript",
  "targetLanguage": "python",
  "apiKey": "sk-..."
}
```

Response shape:

```json
{
  "translatedCode": "string"
}
```

## Scripts

- `npm run dev`: Start development server.
- `npm run build`: Build production app.
- `npm run start`: Run production server.
- `npm run lint`: Run ESLint.

## Project Structure

- `app/page.tsx`: Main interface and mode switching.
- `app/api/review/route.ts`: Review API endpoint.
- `app/api/translate/route.ts`: Translation API endpoint.
- `components/*`: UI components for editor, review view, and translation flow.
