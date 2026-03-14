# flute-notation
Electron app that maps note sequences to fingering diagrams and staff notation for wind instruments

## What it does
Enter a sequence of notes (e.g. `C4, D4, E4`) and the app renders a card for each note showing:

- **Staff notation** — the note on a treble clef staff
- **Fingering diagram** — an SVG illustration of the instrument with the correct keys highlighted (via [u/Celessor](https://www.reddit.com/user/Celessor/) on [Reddit](https://www.reddit.com/r/Flute/comments/a69e0b/flute_fingering_svg/))

## Features
- **Note input** — type notes directly (`E4, Bb4, F#5`)
- **Virtual keyboard** — chromatic note buttons by octave (B3 – B5), toggle between flat (♭) and sharp (#) notation
- **Barline separators** — insert `|` or `||` between notes (or use the virtual keyboard) to render double bar lines for phrasing
- **Multiple fingerings** — notes with alternate fingerings allow switching between them
- **View toggles** — independently show or hide the staff notation and/or fingering diagram

## Note format
Notes follow standard pitch notation: `[A-G][b|#][octave]`

| Example | Meaning |
|---------|---------|
| `C4` | Middle C |
| `Bb4` | B-flat, 4th octave |
| `F#5` | F-sharp, 5th octave |
| `\|\|` | Barline separator |

## Development
```bash
npm install
npm run dev       # start dev server
npm test          # run unit tests (Vitest)
npm run build     # production build
```

## Tech stack
- [Electron](https://www.electronjs.org/) + [electron-vite](https://electron-vite.org/)
- TypeScript
- [VexFlow](https://www.vexflow.com/) for staff rendering
- [Vitest](https://vitest.dev/) for unit tests

Made in an afternoon with Claude Code.
