# Documentation

This repository organizes documentation by document type first: ADRs record decisions, specs describe the current intended design, and plans track active implementation work. ADRs are mostly immutable historical records, specs are living documents, and plans are mutable working documents that may be revised, completed, or superseded over time.

## Doc Types

- `docs/adr/`: architecture decision records and durable platform choices
- `docs/specs/`: living technical design documents
- `docs/plans/`: mutable implementation and execution plans

## Current Core Docs

- `docs/adr/0001-platform-architecture.md`
- `docs/adr/0002-secret-bootstrap-and-1password-integration.md`
- `docs/adr/0003-runtime-secret-materialization.md`
- `docs/adr/0004-local-substrate-selection.md`
- `docs/adr/0005-session-exposure-and-routing.md`
- `docs/adr/0006-session-index-stack-and-api-boundary.md`
- `docs/specs/platform/tech-spec.md`
- `docs/specs/platform/session-index-api.md`
- `docs/specs/platform/session-index-ux.md`
- `docs/plans/`

## Current Defaults

- `fnox` retrieves secret values from `1Password`
- backend code prefers `Go`
- frontend code prefers `TypeScript`
- v1 requires an explicit frontend/backend API contract before UI implementation
- v1 avoids SSR and avoids `React Router`
- `dprint` is the public formatting entrypoint
