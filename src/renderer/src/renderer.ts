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
const octaveBtns = document.querySelectorAll<HTMLButtonElement>('.octave-btn:not(#accidental-toggle)')
const accidentalToggleBtn = document.getElementById('accidental-toggle') as HTMLButtonElement
const notesRow = document.getElementById('notes-row') as HTMLElement
const themeToggleBtn = document.getElementById('theme-toggle') as HTMLButtonElement
const toggleStaveBtn = document.getElementById('toggle-stave') as HTMLButtonElement
const toggleFingeringBtn = document.getElementById('toggle-fingering') as HTMLButtonElement

// ── Theme ──────────────────────────────────────────────────────────────────
function applyTheme(theme: 'dark' | 'light'): void {
  document.documentElement.dataset.theme = theme
  themeToggleBtn.textContent = theme === 'dark' ? '☀️' : '🌙'
}

const savedTheme = (localStorage.getItem('theme') as 'dark' | 'light' | null) ?? 'dark'
applyTheme(savedTheme)

themeToggleBtn.addEventListener('click', () => {
  const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'
  localStorage.setItem('theme', next)
  applyTheme(next)
})

// ── View toggles ───────────────────────────────────────────────────────────
let showStave     = localStorage.getItem('showStave')     !== 'false'
let showFingering = localStorage.getItem('showFingering') !== 'false'

function syncToggleButtons(): void {
  toggleStaveBtn.classList.toggle('active', showStave)
  toggleFingeringBtn.classList.toggle('active', showFingering)
}
syncToggleButtons()

toggleStaveBtn.addEventListener('click', () => {
  if (showStave && !showFingering) return  // last active — block
  showStave = !showStave
  localStorage.setItem('showStave', String(showStave))
  syncToggleButtons()
  render()
})

toggleFingeringBtn.addEventListener('click', () => {
  if (showFingering && !showStave) return  // last active — block
  showFingering = !showFingering
  localStorage.setItem('showFingering', String(showFingering))
  syncToggleButtons()
  render()
})

// ── Init components ────────────────────────────────────────────────────────
initInstrumentSelect(instrumentSelect, instruments, store)

initNoteInput(noteInput, clearBtn, noteButtons, octaveBtns, accidentalToggleBtn, store)

// ── Render on state change ─────────────────────────────────────────────────
function render(): void {
  const { currentInstrument, noteSequence } = store.getState()
  notesRow.innerHTML = ''

  noteSequence.forEach(item => {
    // Barline separator
    if (item.type === 'separator') {
      const bar = document.createElement('div')
      bar.className = 'barline'
      notesRow.appendChild(bar)
      return
    }

    // Note card
    const card = document.createElement('div')
    card.className = 'note-card'

    if (showStave) {
      const staveContainer = document.createElement('div')
      staveContainer.className = 'note-stave'
      renderNoteCard(staveContainer, item)
      card.appendChild(staveContainer)
    }

    // Note name label (always shown)
    const label = document.createElement('span')
    label.className = 'note-label'
    label.textContent = item.original
    card.appendChild(label)

    if (showFingering) {
      const options = currentInstrument.fingeringChart[item.chartKey]
      if (options !== undefined) {
        if (options.length === 1) {
          card.appendChild(buildFingeringSVG(currentInstrument.svgTemplate(), options[0]))
        } else {
          const wrapper = document.createElement('div')
          wrapper.className = 'fingering-wrapper'

          const svgContainer = document.createElement('div')
          svgContainer.appendChild(buildFingeringSVG(currentInstrument.svgTemplate(), options[0]))
          wrapper.appendChild(svgContainer)

          const selector = document.createElement('div')
          selector.className = 'fingering-selector'

          options.forEach((keys, i) => {
            const btn = document.createElement('button')
            btn.className = 'fing-btn' + (i === 0 ? ' active' : '')
            btn.textContent = String(i + 1)
            btn.addEventListener('click', () => {
              svgContainer.innerHTML = ''
              svgContainer.appendChild(buildFingeringSVG(currentInstrument.svgTemplate(), keys))
              selector.querySelectorAll('.fing-btn').forEach((b, j) => {
                b.classList.toggle('active', j === i)
              })
            })
            selector.appendChild(btn)
          })

          wrapper.appendChild(selector)
          card.appendChild(wrapper)
        }
      } else {
        const unknownEl = document.createElement('div')
        unknownEl.className = 'unknown-note'
        unknownEl.textContent = '?'
        unknownEl.title = `No fingering defined for ${item.chartKey}`
        card.appendChild(unknownEl)
      }
    }

    notesRow.appendChild(card)
  })
}

store.subscribe(render)

// ── Initial render ─────────────────────────────────────────────────────────
render()
