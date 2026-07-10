# spacexOS

A retro web operating system built with vanilla HTML, CSS, and JavaScript for Hack Club.

## Features

- **Multiple draggable windows** — open and arrange apps freely
- **10 apps** — About, Notes, Terminal, Synth, Draw, Calculator, Game, **Pomodoro Timer**, **Tic-Tac-Toe**, **Todo List**
- **Changeable backgrounds** — click "Wallpaper" button to cycle through 3 space themes
- **20+ terminal commands** — joke, roll, flip, 8ball, quote, fortune, ascii art, and more
- **Web synthesizer** — play 7-note keyboard with Web Audio API
- **Canvas drawing** — draw with colors and adjustable brush sizes
- **Meteor Dodge game** — arcade-style dodging game
- **Persistent storage** — notes, scores, todos, and window positions save to localStorage
- **Keyboard shortcuts** — press 1-7 to launch apps, ESC to close windows

## How to Run

```bash
cd /path/to/spacexOS
python3 -m http.server 8000
```

Then open `http://localhost:8000` in your browser.

## Apps

- **About** — info about me and my skills (tagged with tech badges)
- **Notes** — save notes to localStorage with auto-save
- **Terminal** — retro green-on-black terminal with 20+ commands
- **Synth** — 7-key synthesizer with triangle wave sounds
- **Draw** — canvas painting app with 6 colors and brush sizes
- **Calculator** — basic arithmetic operations with LED display
- **Game** — Meteor Dodge arcade game (dodge meteors, collect orbs)
- **Pomodoro Timer** — 25-minute productivity timer with start/pause/reset
- **Tic-Tac-Toe** — play vs AI, human-like retro style
- **Todo List** — add/check/delete tasks, saves to localStorage

## Built With

- **Vanilla JavaScript** — no frameworks, window manager from scratch
- **CSS3** — Papyrus font, retro 3D beveled buttons, grid layout
- **HTML5 Canvas** — game rendering and drawing app
- **Web Audio API** — synthesizer and sound effects
- **localStorage** — persistence for notes, scores, todos, wallpaper choice

## Design Notes

Human-made retro aesthetic with:
- Comic Sans/Papyrus cursive fonts
- Gray beveled buttons (Windows 95 style)
- Colorful app icons with tilted animations
- Black desktop with subtle grid pattern
- No blur effects or glassmorphism — pure retro vibes
