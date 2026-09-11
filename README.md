# AI Workplace Productivity Assistant

## Project Overview

**AI Workplace Productivity Assistant** is a modern, responsive
SaaS-style web application designed to help professionals improve
workplace productivity using AI-powered tools.

The application provides a centralized workspace for generating
professional emails, planning tasks, and interacting with an AI
workplace assistant. It focuses on a clean, friendly, and professional
user experience with a royal-blue and white visual identity.

This project is a **frontend-only prototype**. AI responses and saved
content are simulated using frontend/local state, so no backend,
database, authentication, or external AI API is required.

## Features Implemented

### 📧 AI Email Generator

-   Generate professional workplace emails from user-provided context.
-   Choose between **Formal, Friendly, and Persuasive** tones.
-   Generate short, standard, or detailed responses.
-   Edit generated emails.
-   Improve, regenerate, copy, and save AI-generated content.

### 📋 AI Task Planner

-   Create daily or weekly productivity plans.
-   Add tasks, priorities, and deadlines.
-   Generate prioritized schedules.
-   Organize work into realistic focus periods and breaks.
-   Edit and regenerate plans.

### 💬 AI Workplace Chat

-   Interactive AI workplace assistant interface.
-   Get assistance with brainstorming, decision-making, meetings,
    writing, productivity, and workplace problem-solving.
-   Includes suggested prompts for common workplace tasks.
-   Provides simulated AI-generated responses.

### 📊 Dashboard & AI Insights

-   Personalized productivity dashboard.
-   Today's priorities and upcoming tasks.
-   Productivity summaries.
-   AI-generated recommendations and workplace insights.
-   Recent AI-generated work.

### 💾 Saved Work

-   Save and access generated emails, task plans, conversations, and
    recommendations.
-   Uses frontend/local state rather than a database.

### 🎨 User Experience

-   Responsive desktop, tablet, and mobile design.
-   Modern SaaS dashboard layout.
-   Sidebar navigation.
-   Editable AI outputs.
-   Loading, empty, and error states.
-   Copy, save, improve, and regenerate actions.
-   Responsible AI disclaimer.

## Technologies and Tools Used

-   **React** --- Component-based user interface development.
-   **TypeScript** --- Type-safe application development.
-   **Vite** --- Fast frontend development and build tooling.
-   **Tailwind CSS** --- Responsive styling and design system.
-   **shadcn/ui** --- Reusable modern UI components.
-   **Lucide React** --- Interface icons.
-   **Lovable** --- AI-assisted application development and prototyping.
-   **Git & GitHub** --- Version control and project repository
    management.

## Setup Instructions

### Prerequisites

Make sure the following are installed:

-   Node.js (LTS recommended)
-   npm
-   Git

### 1. Clone the repository

``` bash
git clone <your-repository-url>
cd ai-workplace-productivity-assistant
```

### 2. Install dependencies

``` bash
npm install
```

### 3. Start the development server

``` bash
npm run dev
```

Open the local URL displayed in the terminal, typically:

``` text
http://localhost:5173
```

### 4. Build for production

``` bash
npm run build
```

### 5. Preview the production build

``` bash
npm run preview
```

## Responsible AI

The application is intended as a productivity support tool. AI-generated
content may contain inaccuracies or unsuitable recommendations and
should be reviewed by the user before being used in a professional
setting. AI output should not replace professional judgment,
organizational policies, or human decision-making.

## Project Status

**Status:** Frontend prototype / portfolio project

The current version does not use a backend, database, authentication
system, or live AI API. AI functionality is represented through
simulated responses and frontend interactions.
