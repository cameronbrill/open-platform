# Open Platform

Open Platform is a docs-first monorepo for a local single-user OpenCode platform.

Start with `docs/README.md` for architecture, requirements, and plan navigation.

## Quick Start

- `mise install`
- `pnpm install`
- `mise run docs:qmd:init`
- `mise run check`
- `hk install --mise`

## Working Rules

- use `mise` as the public entrypoint for repo tasks
- use `gt` for normal branch and pull request operations
- keep `main` clean and prefer small stacked changes
- use `fnox` for local secret-aware workflows after `infisical login`
