import { Renderer, Stave, StaveNote, Voice, Formatter, Accidental } from 'vexflow'
import type { ParsedNote } from '../utils/note-parser'

const CLEF_WIDTH = 60
const NOTE_SLOT_WIDTH = 80
const STAVE_Y = 40
const SVG_HEIGHT = 160

export interface NotePositions {
  xs: number[]
  staveX: number
}

export function renderStave(
  container: HTMLElement,
  notes: ParsedNote[],
): NotePositions {
  // Clear previous render
  container.innerHTML = ''

  if (notes.length === 0) {
    return { xs: [], staveX: 10 }
  }

  const staveX = 10
  const staveWidth = CLEF_WIDTH + notes.length * NOTE_SLOT_WIDTH
  const svgWidth = staveX + staveWidth + 20

  const renderer = new Renderer(container, Renderer.Backends.SVG)
  renderer.resize(svgWidth, SVG_HEIGHT)
  const context = renderer.getContext()

  const stave = new Stave(staveX, STAVE_Y, staveWidth)
  stave.addClef('treble')
  stave.setContext(context).draw()

  const staveNotes = notes.map(
    n => new StaveNote({ keys: [n.vexKey], duration: 'q' }),
  )

  const voice = new Voice({ num_beats: notes.length, beat_value: 4 })
  voice.setMode(Voice.Mode.SOFT)
  voice.addTickables(staveNotes)

  // Automatically add accidental symbols where needed (key = C major / no accidentals in key sig)
  Accidental.applyAccidentals([voice], 'C')

  new Formatter()
    .joinVoices([voice])
    .format([voice], staveWidth - CLEF_WIDTH - 10)

  voice.draw(context, stave)

  // Collect absolute X positions of each note head (available after draw)
  const xs = staveNotes.map(sn => sn.getAbsoluteX())

  return { xs, staveX }
}
