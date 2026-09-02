# Match4

A modular HTML, CSS, and JavaScript game built for Vercel, with a structure that can eventually move to Angular.

## Project Structure

marilou-match4/
│
├── index.html
│
├── css/
│   ├── base.css
│   ├── world-select.css
│   └── world-intro.css
│
└── js/
    ├── core/
    │   ├── router.js
    │   ├── audio.js
    │   └── treasury.js
    │
    ├── ui/
    │   ├── world-select.js
    │   ├── world-intro.js
    │   └── toast.js
    │
    └── worlds/
        ├── world1/
        │   ├── world1.css
        │   ├── world1.config.js
        │   └── world1.behavior.js
        │
        ├── world2/
        │   ├── world2.css
        │   ├── world2.config.js
        │   └── world2.behavior.js
        │
        └── world3/
            ├── world3.css
            ├── world3.config.js
            └── world3.behavior.js

## What the Files Do

index.html — Main HTML shell.
base.css — Shared styling.
world-select.css — World selection screen styling.
world-intro.css — World introduction screen styling.
router.js — Switches between screens and worlds.
audio.js — Game sounds.
treasury.js — Coins and gems.
world-select.js — World selection behavior.
world-intro.js — World intro behavior.
toast.js — Temporary notifications.

## World Folders

Each world keeps its own styling, configuration, and behavior together.

world1/
├── world1.css          # Appearance
├── world1.config.js    # Developer settings
└── world1.behavior.js  # Gameplay logic

World 2 and World 3 follow the same pattern.

## Architecture

World
├── CSS       → Appearance
├── Config    → Settings
└── Behavior  → Gameplay

The project stays simple and works as a static Vercel site while keeping the worlds separated for a future Angular migration.
