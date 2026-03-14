export interface ParsedNote {
  type: 'note'
  original: string   // "Ab4"
  letter: string     // "A"
  accidental: string // "b"
  octave: number     // 4
  vexKey: string     // "ab/4"  (VexFlow format)
  chartKey: string   // "Ab4"   (fingeringChart key)
}

export interface Separator {
  type: 'separator'
  original: string   // '|' or '||'
}

export type SequenceItem = ParsedNote | Separator

const NOTE_REGEX = /^([A-G])([b#]{0,2})(\d+)$/

export function parseNote(input: string): ParsedNote | null {
  const match = input.trim().match(NOTE_REGEX)
  if (!match) return null
  const [, letter, accidental, octaveStr] = match
  const octave = parseInt(octaveStr, 10)
  return {
    type: 'note',
    original: input.trim(),
    letter,
    accidental,
    octave,
    vexKey: `${letter.toLowerCase()}${accidental}/${octave}`,
    chartKey: `${letter}${accidental}${octave}`,
  }
}

function tokenize(input: string): string[] {
  const tokens: string[] = []
  const re = /\|\||[|]|[^\s,|]+/g
  let m: RegExpExecArray | null
  while ((m = re.exec(input)) !== null) tokens.push(m[0])
  return tokens
}

export function parseNoteSequence(input: string): SequenceItem[] {
  return tokenize(input)
    .map((token): SequenceItem | null => {
      if (token === '||' || token === '|') return { type: 'separator', original: token }
      return parseNote(token)
    })
    .filter((item): item is SequenceItem => item !== null)
}
