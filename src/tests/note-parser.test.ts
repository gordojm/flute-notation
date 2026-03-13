import { describe, it, expect } from 'vitest'
import { parseNote, parseNoteSequence } from '../renderer/src/utils/note-parser'

describe('parseNote', () => {
  it('parses a natural note', () => {
    expect(parseNote('C4')).toEqual({
      original: 'C4',
      letter: 'C',
      accidental: '',
      octave: 4,
      vexKey: 'c/4',
      chartKey: 'C4',
    })
  })

  it('parses a flat note', () => {
    expect(parseNote('Ab4')).toEqual({
      original: 'Ab4',
      letter: 'A',
      accidental: 'b',
      octave: 4,
      vexKey: 'ab/4',
      chartKey: 'Ab4',
    })
  })

  it('parses a sharp note', () => {
    expect(parseNote('G#5')).toEqual({
      original: 'G#5',
      letter: 'G',
      accidental: '#',
      octave: 5,
      vexKey: 'g#/5',
      chartKey: 'G#5',
    })
  })

  it('parses Bb4 correctly (not confusing with Bbb)', () => {
    const result = parseNote('Bb4')
    expect(result?.letter).toBe('B')
    expect(result?.accidental).toBe('b')
    expect(result?.vexKey).toBe('bb/4')
  })

  it('returns null for invalid input', () => {
    expect(parseNote('x')).toBeNull()
    expect(parseNote('')).toBeNull()
    expect(parseNote('c4')).toBeNull() // lowercase note letter is invalid SPN
    expect(parseNote('H4')).toBeNull()
  })
})

describe('parseNoteSequence', () => {
  it('parses comma-separated notes', () => {
    const result = parseNoteSequence('C4, E4, G4')
    expect(result).toHaveLength(3)
    expect(result[0].vexKey).toBe('c/4')
    expect(result[2].vexKey).toBe('g/4')
  })

  it('parses space-separated notes', () => {
    const result = parseNoteSequence('E4 B4 Ab4')
    expect(result).toHaveLength(3)
    expect(result[2].vexKey).toBe('ab/4')
  })

  it('parses mixed comma-and-space separators', () => {
    const result = parseNoteSequence('C4,E4 G4')
    expect(result).toHaveLength(3)
  })

  it('silently skips invalid tokens', () => {
    const result = parseNoteSequence('C4, badnote, G4')
    expect(result).toHaveLength(2)
    expect(result[0].chartKey).toBe('C4')
    expect(result[1].chartKey).toBe('G4')
  })

  it('returns empty array for empty string', () => {
    expect(parseNoteSequence('')).toHaveLength(0)
  })
})
