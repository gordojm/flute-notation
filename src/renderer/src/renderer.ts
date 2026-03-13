import './styles.css'
import { instruments } from './instruments'
import { Store } from './state/store'
import { initInstrumentSelect } from './components/instrument-select'
import { initNoteInput } from './components/note-input'
import { renderStave } from './components/vexflow-renderer'
import { renderFingeringDiagrams } from './components/fingering-display'

// ── Bootstrap ─────────────────────────────────────────────────────────────
const store = new Store({
  currentInstrument: instruments[0],
  noteSequence: [],
})

// ── DOM refs ──────────────────────────────────────────────────────────────
const instrumentSelect = document.getElementById('instrument-select') as HTMLSelectElement
const noteInput = document.getElementById('note-input') as HTMLInputElement
const clearBtn = document.getElementById('clear-btn') as HTMLButtonElement
const noteButtons = document.getElementById('note-buttons') as HTMLElement
const octaveBtns = document.querySelectorAll<HTMLButtonElement>('.octave-btn')
const vexflowContainer = document.getElementById('vexflow-container') as HTMLElement
const fingeringContainer = document.getElementById('fingering-container') as HTMLElement

// ── Init components ────────────────────────────────────────────────────────
initInstrumentSelect(instrumentSelect, instruments, store)

initNoteInput(noteInput, clearBtn, noteButtons, octaveBtns, store)

// ── Render on state change ─────────────────────────────────────────────────
function render(): void {
  const { currentInstrument, noteSequence } = store.getState()
  const positions = renderStave(vexflowContainer, noteSequence)
  renderFingeringDiagrams(fingeringContainer, noteSequence, positions, currentInstrument)
}

store.subscribe(render)

// ── Initial render ─────────────────────────────────────────────────────────
render()
