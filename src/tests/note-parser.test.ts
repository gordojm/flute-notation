import { describe, it, expect } from 'vitest'
import { parseNote, parseNoteSequence } from '../renderer/src/utils/note-parser'

describe('parseNote', () => {
  it('parses a natural note', () => {
    expect(parseNote('C4')).toEqual({
      type: 'note',
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
      type: 'note',
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
      type: 'note',
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

  it('returns null for separator tokens', () => {
    expect(parseNote('|')).toBeNull()
    expect(parseNote('||')).toBeNull()
  })
})

describe('parseNoteSequence', () => {
  it('parses comma-separated notes', () => {
    const result = parseNoteSequence('C4, E4, G4')
    expect(result).toHaveLength(3)
    expect(result[0].type).toBe('note')
    if (result[0].type === 'note') expect(result[0].vexKey).toBe('c/4')
    if (result[2].type === 'note') expect(result[2].vexKey).toBe('g/4')
  })

  it('parses space-separated notes', () => {
    const result = parseNoteSequence('E4 B4 Ab4')
    expect(result).toHaveLength(3)
    if (result[2].type === 'note') expect(result[2].vexKey).toBe('ab/4')
  })

  it('parses mixed comma-and-space separators', () => {
    const result = parseNoteSequence('C4,E4 G4')
    expect(result).toHaveLength(3)
  })

  it('silently skips invalid tokens', () => {
    const result = parseNoteSequence('C4, badnote, G4')
    expect(result).toHaveLength(2)
    if (result[0].type === 'note') expect(result[0].chartKey).toBe('C4')
    if (result[1].type === 'note') expect(result[1].chartKey).toBe('G4')
  })

  it('returns empty array for empty string', () => {
    expect(parseNoteSequence('')).toHaveLength(0)
  })

  it('parses single | as separator', () => {
    const result = parseNoteSequence('|')
    expect(result).toHaveLength(1)
    expect(result[0]).toEqual({ type: 'separator', original: '|' })
  })

  it('parses || as separator', () => {
    const result = parseNoteSequence('||')
    expect(result).toHaveLength(1)
    expect(result[0]).toEqual({ type: 'separator', original: '||' })
  })

  it('parses notes with || barline between them', () => {
    const result = parseNoteSequence('C4 || E4')
    expect(result).toHaveLength(3)
    expect(result[0].type).toBe('note')
    expect(result[1]).toEqual({ type: 'separator', original: '||' })
    expect(result[2].type).toBe('note')
  })

  it('keeps separator alongside invalid tokens (invalid tokens still skipped)', () => {
    const result = parseNoteSequence('C4 || badnote || G4')
    expect(result).toHaveLength(4)
    expect(result[0].type).toBe('note')
    expect(result[1].type).toBe('separator')
    expect(result[2].type).toBe('separator')
    expect(result[3].type).toBe('note')
  })
})
