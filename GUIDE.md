# GUIDE

This is the single working guide for this repository.
Template-style intro content has been removed, and only practical instructions are kept.

## Project Purpose

- Build and render Remotion-based video compositions.
- Main source files are under `src/`.

## Quick Start

```bash
npm i
npm run dev
```

- `npm run dev`: Start Remotion Studio.

## Common Commands

```bash
npm run lint
npm run build
npx remotion render
npx remotion upgrade
```

- `npm run lint`: Run `eslint src` and `tsc`.
- `npm run build`: Create a production bundle.
- `npx remotion render`: Render final video output.
- `npx remotion upgrade`: Upgrade Remotion packages.

## Working Principles

- Keep changes small and run `npm run lint` after each meaningful update.
- Validate composition and timeline changes in `npm run dev` immediately.
- Before final rendering, verify duration, FPS, resolution, and audio sync.

## Folder Hints

- `src/index.ts`: Registers the Remotion root.
- `src/Root.tsx`: Declares compositions.
- `src/Composition.tsx`: Main composition entry.
- `src/trailer/*`: Trailer-related components.
- `public/*`: Static assets.

## Request Template

Use this format when assigning work for faster execution:

```md
[Goal]
- Example: Improve text animation in a 15-second trailer.

[Constraints]
- Example: Keep existing colors and fonts, duration fixed at 450 frames.

[Definition of Done]
- Example: Stronger impact in first 2 seconds and lint passes.
```
