import type { Store } from '../state/store'
import { parseNoteSequence } from '../utils/note-parser'

const CHROMATIC_NOTES = [
  'C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B',
]

export function initNoteInput(
  inputEl: HTMLInputElement,
  clearBtn: HTMLButtonElement,
  noteButtonsEl: HTMLElement,
  octaveBtns: NodeListOf<HTMLButtonElement>,
  store: Store,
): void {
  let selectedOctave = 4

  // ── Octave selector ──────────────────────────────────────────────────────
  octaveBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      octaveBtns.forEach(b => b.classList.remove('active'))
      btn.classList.add('active')
      selectedOctave = parseInt(btn.dataset.octave ?? '4', 10)
    })
  })

  // ── Virtual note buttons ─────────────────────────────────────────────────
  CHROMATIC_NOTES.forEach(note => {
    const btn = document.createElement('button')
    btn.className = 'note-btn' + (note.length > 1 ? ' accidental' : '')
    btn.textContent = note
    btn.title = `Append ${note}`
    btn.addEventListener('click', () => {
      const current = inputEl.value.trim()
      const noteStr = `${note}${selectedOctave}`
      inputEl.value = current ? `${current}, ${noteStr}` : noteStr
      handleChange()
      inputEl.focus()
    })
    noteButtonsEl.appendChild(btn)
  })

  // ── Text input ───────────────────────────────────────────────────────────
  inputEl.addEventListener('input', handleChange)

  clearBtn.addEventListener('click', () => {
    inputEl.value = ''
    handleChange()
    inputEl.focus()
  })

  function handleChange(): void {
    const notes = parseNoteSequence(inputEl.value)
    store.setState({ noteSequence: notes })
  }
}
