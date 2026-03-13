import { Renderer, Stave, StaveNote, Voice, Formatter, Accidental } from 'vexflow'
import type { ParsedNote } from '../utils/note-parser'

const STAVE_X = 10
const STAVE_WIDTH = 160
const STAVE_Y = 50
const CARD_SVG_WIDTH = STAVE_X + STAVE_WIDTH + 10
const CARD_SVG_HEIGHT = 150

export function renderNoteCard(container: HTMLElement, note: ParsedNote): void {
  const renderer = new Renderer(container as HTMLDivElement, Renderer.Backends.SVG)
  renderer.resize(CARD_SVG_WIDTH, CARD_SVG_HEIGHT)
  const context = renderer.getContext()

  const stave = new Stave(STAVE_X, STAVE_Y, STAVE_WIDTH)
  stave.addClef('treble')
  stave.setContext(context).draw()

  const staveNote = new StaveNote({ keys: [note.vexKey], duration: 'q' })

  const voice = new Voice({ numBeats: 1, beatValue: 4 })
  voice.setMode(Voice.Mode.SOFT)
  voice.addTickables([staveNote])

  Accidental.applyAccidentals([voice], 'C')

  new Formatter()
    .joinVoices([voice])
    .format([voice], STAVE_WIDTH - 42) // 42 ≈ clef advance width

  voice.draw(context, stave)
}
