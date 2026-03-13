import './styles.css'
import { instruments } from './instruments'
import { Store } from './state/store'
import { initInstrumentSelect } from './components/instrument-select'
import { initNoteInput } from './components/note-input'
import { renderNoteCard } from './components/vexflow-renderer'
import { buildFingeringSVG } from './components/fingering-display'

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
const notesRow = document.getElementById('notes-row') as HTMLElement

// ── Init components ────────────────────────────────────────────────────────
initInstrumentSelect(instrumentSelect, instruments, store)

initNoteInput(noteInput, clearBtn, noteButtons, octaveBtns, store)

// ── Render on state change ─────────────────────────────────────────────────
function render(): void {
  const { currentInstrument, noteSequence } = store.getState()
  notesRow.innerHTML = ''

  noteSequence.forEach(note => {
    const card = document.createElement('div')
    card.className = 'note-card'

    // Mini stave for this single note
    const staveContainer = document.createElement('div')
    staveContainer.className = 'note-stave'
    renderNoteCard(staveContainer, note)
    card.appendChild(staveContainer)

    // Note name label
    const label = document.createElement('span')
    label.className = 'note-label'
    label.textContent = note.original
    card.appendChild(label)

    // Fingering diagram
    const activeKeys = currentInstrument.fingeringChart[note.chartKey]
    if (activeKeys !== undefined) {
      card.appendChild(buildFingeringSVG(currentInstrument.svgTemplate(), activeKeys))
    } else {
      const unknownEl = document.createElement('div')
      unknownEl.className = 'unknown-note'
      unknownEl.textContent = '?'
      unknownEl.title = `No fingering defined for ${note.chartKey}`
      card.appendChild(unknownEl)
    }

    notesRow.appendChild(card)
  })
}

store.subscribe(render)

// ── Initial render ─────────────────────────────────────────────────────────
render()
