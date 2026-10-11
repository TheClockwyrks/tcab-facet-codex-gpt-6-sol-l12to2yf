# Facet

Facet is a browser puzzle game about matching cut gems and building pressure on the stones that remain. Swap adjacent gems to make lines of three or more. Cleared lines strain their neighbors; flawed stones break with nearby clears and score double. Longer and crossing lines leave special cuts that can turn a single swap into a cascade.

## Run

```bash
npm ci
npm run dev
```

Open the address printed by Vite. To make the self contained static site, run `npm run build` and serve `dist/` from any static server. The generated assets in `public/assets/` are committed; the build does not run an asset generator. `npm run preview` serves the production build locally.

## Controls

Use a mouse, pen, or finger to select a gem and drag onto a neighbor, then release. You can also tap a gem and then its neighbor. Drag back to the first gem to cancel. Use the on screen buttons for menus and pause. Keyboard menus use **↑/↓** and **Enter/Space**; **Esc** or **P** pauses or resumes, **Esc** backs out of help and game over, and **M** mutes audio.

## Development

`npm run typecheck`, `npm run lint`, `npm run format`, and `npm test` check the code. Art, particle systems, music, and sound files live under `public/assets/`. The `scripts/generate-*` files document their one time production; normal installs and builds use the committed outputs directly.
