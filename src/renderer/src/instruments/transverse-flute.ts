import type { Instrument } from './types'
import svgTemplate from '../assets/transverse-flute.svg?raw'

// Standard Boehm system fingerings.
// Each entry is string[][] — an array of fingering options.
// Keys listed = holes/pads that are CLOSED (shown filled/black).
// Enharmonic equivalents are stored as separate entries.
const fingeringChart: Record<string, string[][]> = {
  // ── 3rd octave (B-foot) ──────────────────────────────────────────────────
  B3:  [['key-c', 'key-b', 'key-a', 'key-g', 'key-f', 'key-e', 'key-d', 'key-csharp', 'key-c-roller', 'key-b-roller']],

  // ── 4th octave (C major scale) ──────────────────────────────────────────
  C4:  [['key-c', 'key-b', 'key-a', 'key-g', 'key-f', 'key-e', 'key-d', 'key-csharp', 'key-c-roller']],
  D4:  [['key-c', 'key-b', 'key-a', 'key-g', 'key-f', 'key-e', 'key-d']],
  E4:  [['key-c', 'key-b', 'key-a', 'key-g', 'key-f', 'key-e', 'key-eflat']],
  F4:  [['key-c', 'key-b', 'key-a', 'key-g', 'key-f', 'key-eflat']],
  G4:  [['key-c', 'key-b', 'key-a', 'key-g', 'key-eflat']],
  A4:  [['key-c', 'key-b', 'key-a', 'key-eflat']],
  B4:  [['key-c', 'key-b', 'key-eflat']],

  // ── 4th octave accidentals ───────────────────────────────────────────────
  'C#4': [['key-c', 'key-b', 'key-a', 'key-g', 'key-f', 'key-e', 'key-d', 'key-csharp']],
  Db4:   [['key-c', 'key-b', 'key-a', 'key-g', 'key-f', 'key-e', 'key-d', 'key-csharp']],
  'D#4': [['key-c', 'key-b', 'key-a', 'key-g', 'key-f', 'key-e', 'key-d', 'key-eflat']],
  Eb4:   [['key-c', 'key-b', 'key-a', 'key-g', 'key-f', 'key-e', 'key-d', 'key-eflat']],
  'F#4': [['key-c', 'key-b', 'key-a', 'key-g', 'key-d', 'key-eflat']],
  Gb4:   [['key-c', 'key-b', 'key-a', 'key-g', 'key-d', 'key-eflat']],
  'G#4': [['key-c', 'key-b', 'key-a', 'key-g', 'key-gsharp', 'key-eflat']],
  Ab4:   [['key-c', 'key-b', 'key-a', 'key-g', 'key-gsharp', 'key-eflat']],
  'A#4': [
    ['key-c', 'key-b', 'key-f', 'key-eflat'],            // 1. 1-and-1 Bb
    ['key-bflat', 'key-b', 'key-eflat'],                 // 2. Thumb Bb
    ['key-c', 'key-b', 'key-bflat-lever', 'key-eflat'],  // 3. Side/Lever Bb
  ],
  Bb4: [
    ['key-c', 'key-b', 'key-f', 'key-eflat'],            // 1. 1-and-1 Bb
    ['key-bflat', 'key-b', 'key-eflat'],                 // 2. Thumb Bb
    ['key-c', 'key-b', 'key-bflat-lever', 'key-eflat'],  // 3. Side/Lever Bb
  ],

  // ── 5th octave (C major scale) ──────────────────────────────────────────
  C5:  [['key-b', 'key-eflat']],
  D5:  [['key-c', 'key-a', 'key-g', 'key-f', 'key-e', 'key-d']],
  E5:  [['key-c', 'key-b', 'key-a', 'key-g', 'key-f', 'key-e', 'key-eflat']],
  F5:  [['key-c', 'key-b', 'key-a', 'key-g', 'key-f', 'key-eflat']],
  G5:  [['key-c', 'key-b', 'key-a', 'key-g', 'key-eflat']],
  A5:  [['key-c', 'key-b', 'key-a', 'key-eflat']],
  B5:  [['key-c', 'key-b', 'key-eflat']],

  // ── 5th octave accidentals ───────────────────────────────────────────────
  'C#5': [['key-eflat']],
  Db5:   [['key-eflat']],
  'D#5': [['key-c', 'key-a', 'key-g', 'key-f', 'key-e', 'key-d', 'key-eflat']],
  Eb5:   [['key-c', 'key-a', 'key-g', 'key-f', 'key-e', 'key-d', 'key-eflat']],
  'F#5': [['key-c', 'key-b', 'key-a', 'key-g', 'key-d', 'key-eflat']],
  Gb5:   [['key-c', 'key-b', 'key-a', 'key-g', 'key-d', 'key-eflat']],
  'G#5': [['key-c', 'key-b', 'key-a', 'key-g', 'key-gsharp', 'key-eflat']],
  Ab5:   [['key-c', 'key-b', 'key-a', 'key-g', 'key-gsharp', 'key-eflat']],
  'A#5': [
    ['key-c', 'key-b', 'key-f', 'key-eflat'],            // 1. 1-and-1 Bb
    ['key-bflat', 'key-b', 'key-eflat'],                 // 2. Thumb Bb
    ['key-c', 'key-b', 'key-bflat-lever', 'key-eflat'],  // 3. Side/Lever Bb
  ],
  Bb5: [
    ['key-c', 'key-b', 'key-f', 'key-eflat'],            // 1. 1-and-1 Bb
    ['key-bflat', 'key-b', 'key-eflat'],                 // 2. Thumb Bb
    ['key-c', 'key-b', 'key-bflat-lever', 'key-eflat'],  // 3. Side/Lever Bb
  ],
}

export const transverseFlute: Instrument = {
  id: 'transverse-flute',
  name: 'Transverse Flute',
  svgTemplate: () => svgTemplate,
  fingeringChart,
}
