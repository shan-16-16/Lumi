# Lumi

Lumi is a warm mental-health support companion represented by a black cat. It provides emotional support and general information, and is not a substitute for professional mental-health care.

## Architecture

- React + Vite frontend
- Supabase email/password authentication
- Supabase Postgres with Row Level Security for users' conversations, messages, and settings
- Supabase Edge Function for the server-side Gemini request
- Gemini API key never reaches the browser

## Local setup

Install dependencies:

```bash
npm install
```

Copy `.env.example` to `.env` and provide the Supabase URL and anon key used by the frontend.

The project is already configured to run in the hosted Bolt environment. For a local Vite preview, use:

```bash
npm run dev
```

## Gemini setup

The Gemini key must be configured as the `GEMINI_API_KEY` secret for the `lumi-chat` Supabase Edge Function. The model is read from `GEMINI_MODEL` and defaults to `gemini-2.0-flash`.

Do not put Gemini credentials in frontend environment variables or client-side code.

## Deployment

Deploy the frontend using the normal Vite build output. The Supabase Edge Function is deployed independently and needs these server-side values available:

- `GEMINI_API_KEY`
- `GEMINI_MODEL`
- Supabase-provided function environment values

The database schema is applied through Supabase migrations and all user data is protected by authenticated owner-scoped policies.

## Safety

Lumi does not diagnose conditions, prescribe medication, or replace professional care. In an immediate crisis, contact local emergency services or a crisis service in your area.
