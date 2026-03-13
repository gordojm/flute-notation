import type { Instrument } from './types'
import svgTemplate from '../assets/transverse-flute.svg?raw'

// Standard Boehm system fingerings.
// Keys listed = holes/pads that are CLOSED (shown filled/black).
// Enharmonic equivalents are stored as separate entries pointing to the same array.
const fingeringChart: Record<string, string[]> = {
  // ── 4th octave (C major scale) ──────────────────────────────────────────
  C4:  ['key-b', 'key-a', 'key-g', 'key-c', 'key-f', 'key-e', 'key-d'],
  D4:  ['key-b', 'key-a', 'key-g', 'key-f', 'key-e', 'key-d'],
  E4:  ['key-b', 'key-a', 'key-g', 'key-f', 'key-e'],
  F4:  ['key-b', 'key-a', 'key-g', 'key-f'],
  G4:  ['key-b', 'key-a', 'key-g'],
  A4:  ['key-b', 'key-a'],
  B4:  ['key-b'],

  // ── 4th octave accidentals ───────────────────────────────────────────────
  'C#4': ['key-b', 'key-a', 'key-g', 'key-csharp', 'key-f', 'key-e', 'key-d'],
  Db4:   ['key-b', 'key-a', 'key-g', 'key-csharp', 'key-f', 'key-e', 'key-d'],
  'D#4': ['key-b', 'key-a', 'key-g', 'key-f', 'key-e', 'key-d', 'key-eflat'],
  Eb4:   ['key-b', 'key-a', 'key-g', 'key-f', 'key-e', 'key-d', 'key-eflat'],
  'F#4': ['key-b', 'key-a', 'key-g', 'key-f', 'key-trill-1'],
  Gb4:   ['key-b', 'key-a', 'key-g', 'key-f', 'key-trill-1'],
  'G#4': ['key-b', 'key-a', 'key-gsharp'],
  Ab4:   ['key-b', 'key-a', 'key-gsharp'],
  'A#4': ['key-b', 'key-bflat'],
  Bb4:   ['key-b', 'key-bflat'],

  // ── 5th octave (C major scale — overblown; thumb key lifted for most) ───
  C5:  ['key-a', 'key-g', 'key-c', 'key-f', 'key-e', 'key-d'],
  D5:  ['key-a', 'key-g', 'key-f', 'key-e', 'key-d'],
  E5:  ['key-a', 'key-g', 'key-f', 'key-e'],
  F5:  ['key-b', 'key-a', 'key-g', 'key-f'],
  G5:  ['key-b', 'key-a', 'key-g'],
  A5:  ['key-b', 'key-a'],
  B5:  ['key-b'],

  // ── 5th octave accidentals ───────────────────────────────────────────────
  'C#5': ['key-a', 'key-g', 'key-csharp', 'key-f', 'key-e', 'key-d'],
  Db5:   ['key-a', 'key-g', 'key-csharp', 'key-f', 'key-e', 'key-d'],
  'D#5': ['key-a', 'key-g', 'key-f', 'key-e', 'key-d', 'key-eflat'],
  Eb5:   ['key-a', 'key-g', 'key-f', 'key-e', 'key-d', 'key-eflat'],
  'F#5': ['key-b', 'key-a', 'key-g', 'key-f', 'key-trill-1'],
  Gb5:   ['key-b', 'key-a', 'key-g', 'key-f', 'key-trill-1'],
  'G#5': ['key-b', 'key-a', 'key-gsharp'],
  Ab5:   ['key-b', 'key-a', 'key-gsharp'],
  'A#5': ['key-b', 'key-bflat'],
  Bb5:   ['key-b', 'key-bflat'],
}

export const transverseFlute: Instrument = {
  id: 'transverse-flute',
  name: 'Transverse Flute',
  svgTemplate: () => svgTemplate,
  fingeringChart,
}
