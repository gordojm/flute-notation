import type { Store } from '../state/store'
import { parseNoteSequence } from '../utils/note-parser'

const SHARPS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
const FLATS  = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B']

// Octaves where only a subset of notes exist on the instrument
const OCTAVE_ALLOWED: Record<number, string[]> = {
  3: ['B'],
}

export function initNoteInput(
  inputEl: HTMLInputElement,
  clearBtn: HTMLButtonElement,
  noteButtonsEl: HTMLElement,
  octaveBtns: NodeListOf<HTMLButtonElement>,
  accidentalToggleBtn: HTMLButtonElement,
  store: Store,
): void {
  let selectedOctave = 4
  let useFlats = localStorage.getItem('useFlats') !== 'false'

  function renderNoteButtons(): void {
    noteButtonsEl.innerHTML = ''
    const notes = useFlats ? FLATS : SHARPS
    const allowed = OCTAVE_ALLOWED[selectedOctave]

    notes.forEach(note => {
      if (allowed && !allowed.includes(note)) return
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

    // ── Separator button (always last) ────────────────────────────────────
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
  }

  function syncAccidentalToggle(): void {
    accidentalToggleBtn.textContent = useFlats ? '♭' : '#'
    accidentalToggleBtn.title = useFlats ? 'Switch to sharps (#)' : 'Switch to flats (♭)'
  }

  // ── Octave selector ──────────────────────────────────────────────────────
  octaveBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      octaveBtns.forEach(b => b.classList.remove('active'))
      btn.classList.add('active')
      selectedOctave = parseInt(btn.dataset.octave ?? '4', 10)
      renderNoteButtons()
    })
  })

  // ── Accidental toggle ────────────────────────────────────────────────────
  accidentalToggleBtn.addEventListener('click', () => {
    useFlats = !useFlats
    localStorage.setItem('useFlats', String(useFlats))
    syncAccidentalToggle()
    renderNoteButtons()
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

  // ── Initial render ───────────────────────────────────────────────────────
  syncAccidentalToggle()
  renderNoteButtons()
}
