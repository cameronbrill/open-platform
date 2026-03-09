# Session Index and Operator UX

- Status: Draft
- Date: 2026-03-08
- Scope: thin operator-facing session management UI, explicit API contract, and recovery commands
- Depends on:
  - `docs/plans/04-session-runtime.md`
- Blocks:
  - `docs/plans/06-observability-and-hardening.md`

## Purpose

Provide the single-user operator with the supported UX for normal platform use.

## In Scope

- thin session index page
- typed frontend/backend API contract
- session lifecycle commands
- local URL discovery
- operator recovery commands
- normal day-to-day UX

## Out of Scope

- richer custom chat UX beyond `opencode web`
- SSR in v1
- `React Router` in v1
- remote or mobile access beyond responsive readiness

## Deliverables

- `apps/session-index/`
- `docs/specs/platform/session-index-api.md`
- `docs/specs/platform/session-index-ux.md`
- session lifecycle `mise` commands
- `mise run session:create`
- `mise run session:list`
- `mise run session:delete`
- `mise run session:open`
- `mise run session:logs`
- `mise run cluster:reset`

## Tasks

### Frontend / Backend Boundary

- implement the chosen Go backend and TypeScript frontend boundary
- keep orchestration logic on the backend
- keep the frontend thin and typed
- allow static frontend assets in v1 if they preserve the thin operator-console model

### API Contract

- finalize session resource shape
- finalize create/list/open/restart/delete contract
- ensure the UI consumes typed backend data rather than backend implementation details

### State, Error, and Loading UX

- define session state model
- define loading, empty, and error states
- define operator-facing failure and retry behavior

### Responsive and Mobile Behavior

- make the index usable on narrow viewports
- avoid hover-only interaction
- keep the operator mental model simple

### Auth and Open-Session UX

- clarify how the operator opens authenticated sessions
- keep the index page from becoming a general-purpose secret vault
- distinguish auth failures from session failures in UI messaging

### Operator Commands and Recovery UX

- ensure all supported flows exist behind `mise`
- make scripts internal, not public entrypoints
- implement `cluster:doctor`, `cluster:reset`, and session log retrieval
- document the supported recovery path

## Validation

- normal operator use no longer requires raw manifest management
- the API contract covers the supported operator flows
- the index page is enough for common workflows
- the documented recovery path works
- the index remains thin and does not duplicate `opencode web`

## Exit Criteria

- normal daily workflow is coherent and low-friction
- operator can create, open, delete, and recover sessions with supported interfaces
- the frontend/backend contract is stable enough to guide implementation

## Risks / Notes

- keep the index page intentionally thin; if it starts duplicating `opencode web`, scope is drifting
