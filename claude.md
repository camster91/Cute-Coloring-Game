# Calm Drawing

A mindful digital drawing application built with React, focused on creative expression, stress relief, and artistic growth.

## Tech Stack

- **Framework:** React 18 with hooks (no external state management)
- **Build:** Vite 5
- **Styling:** Tailwind CSS 3 + custom animations in `src/index.css`
- **Testing:** Vitest + @testing-library/react + jsdom
- **PWA:** vite-plugin-pwa with Workbox for offline support

## Commands

- `npm run dev` — Start dev server
- `npm run build` — Production build
- `npm run test` — Run tests once (`vitest run`)
- `npm run test:watch` — Run tests in watch mode

## Project Structure

```
src/
├── main.jsx                    # Entry point
├── App.jsx                     # Root component with error boundary
├── index.css                   # Global styles, Tailwind, custom animations
├── components/
│   ├── ColoringGame.jsx        # Main app component (constants, palettes, layout)
│   ├── canvas/                 # Canvas rendering: GridOverlay, FloatingToolbar, LazyBrushIndicator
│   ├── hooks/                  # Custom React hooks (state management)
│   ├── panels/                 # Feature panels: Colors, Tools, Layers, Canvas, Wellness, Mood, Gradient
│   ├── toolbar/                # HeaderBar, StatusBar
│   └── ui/                     # Reusable components: Modal, Sidebar, BottomSheet, Slider, etc.
├── test/
│   ├── setup.js                # Test setup
│   └── colorHarmony.test.js    # Color harmony algorithm tests
```

## Architecture

- **State management:** Custom React hooks in `src/components/hooks/` — no Redux or Zustand. Each hook manages a distinct domain (canvas, tools, layers, colors, wellness, music, etc.).
- **Main component:** `ColoringGame.jsx` is the central orchestrator. It defines all constants (color palettes, canvas sizes, brush types, shapes, symmetry modes) and composes all hooks and panels.
- **UI components:** Reusable primitives in `src/components/ui/` using Tailwind classes with glassmorphism effects.
- **Barrel exports:** Each component directory has an `index.js` re-exporting its modules.

## Key Conventions

- All components are functional React components using JSX (`.jsx` extension).
- Hooks are plain `.js` files prefixed with `use`.
- Styling is utility-first via Tailwind; custom CSS animations are defined in `src/index.css`.
- No linter or formatter is configured in the project yet.
- Test config is in `vite.config.js` under the `test` key (jsdom environment, global test vars enabled).

## Testing

Tests use Vitest with jsdom. Test files live in `src/test/`. Run `npm run test` to execute. Current coverage is limited to color harmony algorithms — the framework is ready for expansion.
