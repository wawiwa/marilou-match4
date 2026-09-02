# Match4

Match4 is a modular HTML, CSS, and JavaScript game designed for static hosting on Vercel, with a structure that keeps each world separated so it can later move toward an Angular architecture without changing the current deployment model.

## Project structure

```text
marilou-match4/
├── index.html
├── css/
│   ├── base.css
│   ├── world-select.css
│   └── world-intro.css
├── js/
│   ├── core/
│   │   ├── audio.js
│   │   ├── router.js
│   │   └── treasury.js
│   ├── ui/
│   │   ├── toast.js
│   │   └── world-select.js
│   └── worlds/
│       ├── world1/
│       │   ├── world1.behavior.js
│       │   ├── world1.config.js
│       │   └── world1.css
│       ├── world2/
│       │   ├── world2.behavior.js
│       │   ├── world2.config.js
│       │   └── world2.css
│       └── world3/
│           ├── world3.behavior.js
│           ├── world3.config.js
│           └── world3.css
└── README.md
```

## What each part does

- index.html — Main HTML shell for the game and screen layout.
- css/base.css — Shared layout and global styling used across the app.
- css/world-select.css — Styling for the world selector screen.
- css/world-intro.css — Styling for the cinematic world intro screens.
- js/core/audio.js — Sound effects and audio setup.
- js/core/router.js — Screen and world switching logic.
- js/core/treasury.js — Shared coins and gems data.
- js/ui/world-select.js — World selection and World 1/2 gameplay behavior.
- js/ui/toast.js — Temporary notification messages.
- js/worlds/world1 — World 1 styling, config, and behavior.
- js/worlds/world2 — World 2 styling, config, and behavior.
- js/worlds/world3 — World 3 styling, config, and behavior.

## World organization

Each world keeps its own appearance, developer settings, and gameplay logic together.

```text
world/
├── world.css
├── world.config.js
└── world.behavior.js
```

This keeps the structure clear and makes future migration to Angular easier without introducing a framework in the current version.

## Architecture

```text
World
├── CSS      → appearance
├── Config   → settings and level data
└── Behavior → gameplay logic
```

The project remains intentionally simple: it works as a static Vercel site while keeping world boundaries clean and ready for future refactoring.
