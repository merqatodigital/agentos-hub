# AgentOS Hub

See image. Build a polished, responsive MERQATO Agent OS dashboard based on the attached reference image.

This is the frontend only. We will download the finished project and connect our existing FastAPI/Hermes backend later. Do not connect to GitHub, create a backend, or add Supabase.

Use React, TypeScript, Tailwind CSS, and Lucide icons. Keep dependencies minimal and ensure the project builds without errors.

Visual style: near-black and deep navy backgrounds, bright white text, subtle cyan/teal accents, thin borders, compact operational panels, and an animated central system orb. No purple or emoji.

Create a functional dashboard with:

- Sidebar: Command Center, Super Agent, Bots, Tasks, Browser, Knowledge, Memory, Approvals, Usage, and Settings.

- Header: Hermes status, active agent, selected model, and Telegram status.

- Main area: system orb, operational metrics, agent cards, model router, live tasks, activity feed, and mission composer.

- Model options: OpenRouter Free, OpenRouter Paid, and Ollama Local.

- Bot section: one primary Super Agent by default, with optional specialist Bots.

- Customer onboarding: business information, document uploads, agent setup, model selection, and Telegram connection.

Desktop and laptop are the primary experience. Tablets should maintain the same visual design with a responsive layout. Phones should show a simplified dashboard with status, tasks, approvals, and a prominent “Continue in Telegram” button.

Use sample data for the visual demonstration, but organize API calls through a single frontend service so our backend can be connected later.

Make navigation, buttons, drawers, forms, and onboarding steps interactive. Build the complete interface as a downloadable project with clean, reusable components.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/08225b56-d074-4f85-bb30-e13b4fe1be72).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
