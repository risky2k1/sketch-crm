# AGENTS.md

## Project Goal

Build a modern, modular, Vercel-friendly CRM inspired by Twenty, but with a distinct polished sketch / hand-drawn visual identity similar to Excalidraw.

The product should feel like:

- A clean SaaS CRM for daily work
- A lightweight modular business app builder
- A polished interface with subtle sketch accents
- Not a toy wireframe app
- Not a full Excalidraw clone

Design direction:

> 80% clean SaaS UI + 20% sketch / hand-drawn accent.

The application must remain readable, professional, fast, and maintainable.

---

## File Location

Place this file at the root of the repository:

```txt
your-crm/
├── AGENTS.md
├── README.md
├── package.json
├── app/
├── components/
├── features/
├── lib/
└── supabase/
```

---

## Primary Tech Stack

Use this stack unless explicitly instructed otherwise:

- pnpm as the required package manager
- Next.js App Router
- TypeScript
- React
- Tailwind CSS
- shadcn/ui
- Radix UI primitives
- Supabase
  - Postgres
  - Auth
  - Storage
  - Row Level Security
- TanStack Table
- React Hook Form
- Zod
- Lucide React
- Rough.js for sketch / hand-drawn visuals
- Perfect Freehand only if the app needs real drawing or annotation features

Avoid introducing heavy dependencies unless there is a clear benefit.

---

## Package Manager

Use pnpm as the only package manager for this project.

Rules:

- Use `pnpm install` to install dependencies.
- Use `pnpm add <package>` to add runtime dependencies.
- Use `pnpm add -D <package>` to add dev dependencies.
- Use `pnpm dev` to run the development server.
- Use `pnpm lint`, `pnpm typecheck`, and `pnpm build` for checks.
- Do not use npm, yarn, or bun unless explicitly instructed.
- Do not create `package-lock.json`, `yarn.lock`, or `bun.lockb`.
- Keep `pnpm-lock.yaml` committed.
---

## Deployment Target

The app must be easy to deploy on Vercel.

Assume:

- Next.js runs on Vercel
- Database/Auth/Storage are handled by Supabase
- No long-running backend server for MVP
- No Redis requirement for MVP
- No background worker requirement for MVP
- Scheduled or async jobs can be added later using Supabase Edge Functions, cron, or external job services

Do not design the MVP like Twenty's full self-hosted architecture with a dedicated API server, Redis, and worker.

---

## Product Scope

This is a CRM and modular business system.

Core CRM modules:

- Workspace
- Users
- Organizations / Companies
- People / Contacts
- Deals / Opportunities
- Tasks
- Notes
- Activities / Timeline
- Tags
- Custom Fields
- Custom Modules

MVP priorities:

1. Authentication
2. Workspace model
3. Companies
4. People
5. Deals
6. Tasks
7. Notes
8. Basic activity timeline
9. Custom fields foundation
10. Clean, reusable UI shell

Do not overbuild automation, workflow builder, email sync, import/export, or plugin marketplace in the MVP.

---

## Visual Design Direction

Combine a professional SaaS layout with subtle hand-drawn details.

Use clean SaaS UI for:

- Sidebar
- Topbar
- Tables
- Forms
- Dialogs
- Dropdowns
- Settings pages
- Data-dense screens

Use sketch accents for:

- Empty states
- Selected cards
- Relationship diagrams
- Lightweight illustrations
- Onboarding screens
- Section dividers
- CTA highlights
- Kanban cards
- Timeline markers
- Object relationship graph

Do not make every UI component look hand-drawn.

The product should feel like:

- Linear / Twenty / Notion clarity
- Excalidraw-inspired accent
- Calm, minimal, slightly playful
- Professional enough for real CRM usage

Avoid:

- Overly childish UI
- Too many random rough borders
- Low contrast text
- Excessive hand-written fonts
- Sketch effects on large data tables
- Visual noise in dashboards

---

## Typography

Use a clean sans-serif font for the main UI.

Recommended main fonts:

- Geist
- Inter
- IBM Plex Sans

Use hand-drawn fonts only for small decorative accents, empty state headings, or annotations.

Recommended accent fonts:

- Virgil, only if licensing is acceptable
- Caveat
- Patrick Hand
- Kalam

Never use a handwritten font for:

- Large tables
- Long paragraphs
- Form inputs
- Core navigation
- Dense CRM data

---

## Color System

Use a calm neutral base.

Recommended direction:

- Background: warm white / off-white
- Surface: white or very light neutral
- Border: soft neutral
- Text: near black
- Accent: one primary brand color
- Sketch line: dark neutral, not pure black everywhere

Support light mode first.

Dark mode can be added later, but the architecture should not block theme support.

Use CSS variables for colors.

---

## Component Strategy

Prefer shadcn/ui as the base component system.

Create custom components in:

```txt
components/ui/
components/layout/
components/crm/
components/sketch/
components/modules/
```

Use Rough.js only in dedicated sketch components.

Examples:

```txt
components/sketch/sketch-card.tsx
components/sketch/sketch-border.tsx
components/sketch/sketch-empty-state.tsx
components/sketch/sketch-relationship-map.tsx
components/sketch/rough-line.tsx
```

Do not scatter Rough.js drawing logic across random feature components.

Keep sketch rendering isolated and reusable.

---

## UI Shell

The main app shell should include:

- Left sidebar
- Workspace switcher placeholder
- Main navigation
- Topbar
- Search / command placeholder
- User menu
- Main content area

Primary navigation:

- Dashboard
- Companies
- People
- Deals
- Tasks
- Notes
- Settings

The shell should be clean and stable.

Sketch accents must not interfere with navigation clarity.

---

## Data Model Guidelines

Use Supabase Postgres.

Design for multi-workspace usage from the beginning.

Every business record should belong to a workspace.

Most tables should include:

```sql
id uuid primary key
workspace_id uuid not null
created_at timestamptz not null
updated_at timestamptz not null
created_by uuid
updated_by uuid
```

Recommended core tables:

```txt
workspaces
workspace_members
profiles

companies
people
deals
tasks
notes
activities
tags
record_tags

custom_modules
custom_fields
custom_records
```

Do not use JSONB for everything.

Use normal relational tables for core CRM objects.

Use JSONB only for flexible custom fields or custom module records where appropriate.

---

## Module System Direction

The app should eventually support custom modules.

A module means a user-defined object type, for example:

- Vendors
- Projects
- Contracts
- Candidates
- Properties
- Tickets

Start with a simple module system:

```txt
custom_modules
- id
- workspace_id
- key
- name
- plural_name
- icon
- description
- created_at
- updated_at

custom_fields
- id
- workspace_id
- module_id
- key
- label
- type
- required
- options_json
- position
- created_at
- updated_at

custom_records
- id
- workspace_id
- module_id
- data_jsonb
- created_by
- updated_by
- created_at
- updated_at
```

Supported custom field types for MVP:

- text
- textarea
- number
- date
- select
- multi_select
- checkbox
- url
- email
- phone

Do not implement a full plugin system in the MVP.

---

## Code Style

Use TypeScript strictly.

Prefer:

- Server Components by default
- Client Components only when needed
- Small focused components
- Explicit types
- Zod schemas for validation
- React Hook Form for complex forms
- Server Actions or Route Handlers where appropriate
- Supabase typed client helpers

Avoid:

- `any` unless there is a strong reason
- Large components with mixed concerns
- Business logic hidden inside UI components
- Duplicated form logic
- Unvalidated inputs
- Hardcoded workspace IDs
- Hardcoded user IDs
- Mixing database queries directly inside deeply nested UI components

---

## Directory Structure

Use a clear structure like:

```txt
app/
  (auth)/
    login/
    register/
  (dashboard)/
    layout.tsx
    page.tsx
    companies/
    people/
    deals/
    tasks/
    notes/
    settings/

components/
  ui/
  layout/
  crm/
  modules/
  sketch/

features/
  companies/
  people/
  deals/
  tasks/
  notes/
  activities/
  custom-fields/
  custom-modules/

lib/
  supabase/
  auth/
  validations/
  utils/
  constants/

supabase/
  migrations/
  seed.sql
```

Feature folders may include:

```txt
components/
actions.ts
queries.ts
schema.ts
types.ts
utils.ts
```

Keep code organized by feature when business logic grows.

---

## Authentication

Use Supabase Auth.

The app should support:

- Email/password login
- Authenticated dashboard
- Profile table synced with auth user
- Workspace membership

Do not build a custom auth system.

All workspace data access must be protected by Row Level Security.

---

## Row Level Security

Supabase RLS is required.

Every workspace-scoped table must have RLS policies.

Users can only access records from workspaces where they are members.

Workspace roles may be:

```txt
owner
admin
member
viewer
```

For MVP, implement at least:

```txt
owner
member
```

Keep policies simple and auditable.

Do not ship workspace data tables without RLS.

---

## Forms and Validation

Use:

- Zod for schema validation
- React Hook Form for client-side forms
- Server-side validation before database writes

Every create/update action should validate input.

Form UX should include:

- Clear labels
- Helpful errors
- Loading state
- Success feedback
- Cancel/back action

Do not rely only on client-side validation.

---

## Tables and Lists

Use TanStack Table for data-heavy screens.

CRM list pages should support:

- Search
- Sort
- Filter placeholder
- Pagination or infinite loading
- Empty state
- Create button

Avoid overcomplicated table features in MVP.

Good MVP list screens:

- Companies list
- People list
- Deals list
- Tasks list

---

## Detail Pages

Each core object should eventually have a detail page.

Example company detail page:

- Header with company name
- Basic fields
- Related people
- Related deals
- Notes
- Activity timeline
- Sketch relationship card or diagram

Use tabs or split sections when needed.

Do not cram too much into one screen.

---

## Sketch UI Implementation Rules

Use Rough.js for decorative sketch visuals.

Rough.js should be used for:

- Hand-drawn borders
- Sketch lines
- Simple doodle illustrations
- Relationship maps
- Empty states
- Visual annotations

Rough.js should not be used for:

- Every button
- Every input
- Data tables
- Dense forms
- Critical accessibility states

Sketch components should be deterministic enough to avoid annoying layout shifts.

Avoid re-randomizing sketch effects on every render if it creates flicker.

Use memoization where appropriate.

---

## Accessibility

Maintain accessibility even with custom visual style.

Requirements:

- Keyboard navigable UI
- Visible focus states
- Semantic HTML
- Labels for form controls
- ARIA only when needed
- Sufficient color contrast
- Dialogs and dropdowns built on Radix/shadcn primitives

Do not sacrifice usability for visual style.

---

## Performance

Prioritize fast page loads and responsive interactions.

Guidelines:

- Use Server Components where possible
- Keep client bundles small
- Avoid heavy animation libraries unless needed
- Avoid rendering complex canvas/SVG repeatedly
- Paginate large lists
- Use indexes in database migrations
- Avoid unnecessary client-side global state

---

## State Management

Start simple.

Prefer:

- Server data from Supabase queries
- URL search params for filters
- Local component state for UI state
- React Hook Form for forms

Do not add Redux, Zustand, or other global state libraries unless there is a clear need.

---

## Error Handling

Handle errors clearly.

For user-facing errors:

- Show simple, useful messages
- Avoid leaking raw database errors
- Log useful developer details where appropriate

For actions:

- Return typed success/error results
- Validate inputs
- Handle Supabase errors
- Avoid silent failures

---

## Testing and Quality

When adding important business logic, include tests where practical.

At minimum:

- Typecheck must pass
- Lint must pass
- Build must pass
- Core forms should be manually testable
- RLS policies should be reviewed carefully

Recommended commands:

```bash
pnpm lint
pnpm typecheck
pnpm build
```

If these scripts do not exist, add them.

---

## Environment Variables

Use environment variables for Supabase config.

Expected variables:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

Never expose `SUPABASE_SERVICE_ROLE_KEY` to the client.

Only use service role key on the server when absolutely required.

---

## Supabase Migration Rules

Use SQL migration files under:

```txt
supabase/migrations/
```

Migration files should be:

- Small enough to review
- Ordered by timestamp
- Clear in naming
- Safe to rerun only if designed that way

Every workspace-scoped table should include RLS policies.

Add indexes for common filters:

- workspace_id
- created_at
- owner_id
- company_id
- person_id
- deal_id
- status

---

## MVP Implementation Order

Implement in this order:

1. Initialize Next.js project
2. Configure Tailwind and shadcn/ui
3. Configure Supabase client helpers
4. Add authentication pages
5. Add dashboard shell
6. Add workspace schema and membership
7. Add companies table and UI
8. Add people table and UI
9. Add deals table and Kanban/list UI
10. Add tasks table and UI
11. Add notes and activity timeline
12. Add sketch UI components
13. Add custom fields foundation
14. Add custom modules foundation
15. Polish UX and deploy to Vercel

Do not start with complex custom module builder before the core CRM is usable.

---

## MVP Acceptance Criteria

The MVP is acceptable when:

- A user can register/login
- A user can access a workspace
- A user can create/list/update/delete companies
- A user can create/list/update/delete people
- A user can create/list/update/delete deals
- A user can create/list/update/delete tasks
- A user can add notes to records
- A user can see a basic activity timeline
- The app has a clean CRM shell
- The UI has subtle sketch identity
- The app can be deployed to Vercel
- Supabase RLS protects workspace data
- Typecheck, lint, and build pass

---

## Important Product Principle

Build a usable CRM first.

Then add sketch personality.

Do not let the visual gimmick make the product harder to use.

The design should feel intentionally crafted, not unfinished.

---

## Communication Rules for Coding Agent

When making changes:

- Explain what changed
- Explain why it changed
- Mention files touched
- Mention any migration added
- Mention commands that should be run
- Mention any assumptions

When uncertain:

- Make a reasonable MVP-focused decision
- Keep the implementation simple
- Avoid overengineering
- Leave clear TODO comments only when useful

---

## Do Not Do

Do not:

- Build a separate NestJS backend for MVP
- Add Redis for MVP
- Add background workers for MVP
- Add a plugin marketplace for MVP
- Add a complex workflow builder for MVP
- Use handwritten fonts everywhere
- Make all components sketchy
- Use JSONB for all core CRM entities
- Disable RLS
- Put service role key in client code
- Add large dependencies without justification
- Over-optimize before the core CRM works
