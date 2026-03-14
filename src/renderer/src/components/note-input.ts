import type { Store } from '../state/store'
import { parseNoteSequence } from '../utils/note-parser'

const CHROMATIC_NOTES = [
  'C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B',
]

// Notes available per octave (octave 3 only has B3 as the lowest flute note)
const OCTAVE_NOTES: Record<number, string[]> = {
  3: ['B'],
  4: CHROMATIC_NOTES,
  5: CHROMATIC_NOTES,
}

export function initNoteInput(
  inputEl: HTMLInputElement,
  clearBtn: HTMLButtonElement,
  noteButtonsEl: HTMLElement,
  octaveBtns: NodeListOf<HTMLButtonElement>,
  store: Store,
): void {
  let selectedOctave = 4

  function updateNoteButtonVisibility(): void {
    const allowed = new Set(OCTAVE_NOTES[selectedOctave] ?? CHROMATIC_NOTES)
    noteButtonsEl.querySelectorAll<HTMLButtonElement>('.note-btn[data-note]').forEach(btn => {
      btn.style.display = allowed.has(btn.dataset.note!) ? '' : 'none'
    })
  }

  // ── Octave selector ──────────────────────────────────────────────────────
  octaveBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      octaveBtns.forEach(b => b.classList.remove('active'))
      btn.classList.add('active')
      selectedOctave = parseInt(btn.dataset.octave ?? '4', 10)
      updateNoteButtonVisibility()
    })
  })

  // ── Virtual note buttons ─────────────────────────────────────────────────
  CHROMATIC_NOTES.forEach(note => {
    const btn = document.createElement('button')
    btn.className = 'note-btn' + (note.length > 1 ? ' accidental' : '')
    btn.dataset.note = note
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

  // ── Separator button ─────────────────────────────────────────────────────
  const sepBtn = document.createElement('button')
  sepBtn.className = 'note-btn separator-btn'
  sepBtn.textContent = '||'
  sepBtn.title = 'Insert barline'
  sepBtn.addEventListener('click', () => {
    const current = inputEl.value.trim()
    inputEl.value = current ? `${current} ||` : '||'
    handleChange()
    inputEl.focus()
  })
  noteButtonsEl.appendChild(sepBtn)

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
