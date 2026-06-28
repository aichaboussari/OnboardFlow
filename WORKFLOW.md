# OnboardFlow Code Workflow

## Branch Strategy
- `main` — production-ready code. Always deployable.
- Feature branches: `feature/<name>` — for new features and changes.

## Process
1. Developer creates a feature branch from `main`
2. Developer works and commits to the feature branch
3. Developer opens a Pull Request to `main`
4. Lead reviews and merges the PR

## Publishing
- After merging to `main`, run `bun run publish` from `/home/team/shared/site` to deploy.

## Initial Setup
The entire app lives in `/home/team/shared/site`. The initial commit should include all source files but exclude `node_modules/`, `dist/`, and build artifacts.