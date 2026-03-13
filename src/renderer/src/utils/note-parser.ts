export interface ParsedNote {
  original: string   // "Ab4"
  letter: string     // "A"
  accidental: string // "b"
  octave: number     // 4
  vexKey: string     // "ab/4"  (VexFlow format)
  chartKey: string   // "Ab4"   (fingeringChart key)
}

const NOTE_REGEX = /^([A-G])([b#]{0,2})(\d+)$/

export function parseNote(input: string): ParsedNote | null {
  const match = input.trim().match(NOTE_REGEX)
  if (!match) return null
  const [, letter, accidental, octaveStr] = match
  const octave = parseInt(octaveStr, 10)
  return {
    original: input.trim(),
    letter,
    accidental,
    octave,
    vexKey: `${letter.toLowerCase()}${accidental}/${octave}`,
    chartKey: `${letter}${accidental}${octave}`,
  }
}

export function parseNoteSequence(input: string): ParsedNote[] {
  return input
    .split(/[\s,]+/)
    .filter(Boolean)
    .map(parseNote)
    .filter((n): n is ParsedNote => n !== null)
}
