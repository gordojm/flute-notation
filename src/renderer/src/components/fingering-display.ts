import type { ParsedNote } from '../utils/note-parser'
import type { Instrument } from '../instruments/types'
import type { NotePositions } from './vexflow-renderer'

const SVG_WIDTH = 254  // matches transverse-flute.svg viewBox width
const SVG_SCALE = 0.7  // scale down to fit nicely

function buildFingeringSVG(
  svgTemplate: string,
  activeKeys: string[],
): SVGSVGElement {
  const wrapper = document.createElement('div')
  wrapper.innerHTML = svgTemplate
  const svgEl = wrapper.querySelector('svg') as SVGSVGElement

  // Scale down — read native height from the SVG element so this works for any instrument
  const nativeHeight = parseFloat(svgEl.getAttribute('height') ?? '66')
  svgEl.setAttribute('width', String(SVG_WIDTH * SVG_SCALE))
  svgEl.setAttribute('height', String(nativeHeight * SVG_SCALE))

  activeKeys.forEach(id => {
    const el = svgEl.querySelector(`#${CSS.escape(id)}`)
    if (el) el.setAttribute('fill', 'black')
  })

  return svgEl
}

export function renderFingeringDiagrams(
  container: HTMLElement,
  notes: ParsedNote[],
  positions: NotePositions,
  instrument: Instrument,
): void {
  container.innerHTML = ''

  if (notes.length === 0) return

  const scaledWidth = SVG_WIDTH * SVG_SCALE
  const { xs } = positions

  notes.forEach((note, i) => {
    const noteX = xs[i] ?? (positions.staveX + 60 + i * 80)

    const cell = document.createElement('div')
    cell.className = 'fingering-cell'

    const label = document.createElement('span')
    label.className = 'note-label'
    label.textContent = note.original
    cell.appendChild(label)

    const activeKeys = instrument.fingeringChart[note.chartKey]

    if (activeKeys !== undefined) {
      const svgEl = buildFingeringSVG(instrument.svgTemplate(), activeKeys)
      cell.appendChild(svgEl)
    } else {
      const unknownEl = document.createElement('div')
      unknownEl.className = 'unknown-note'
      unknownEl.textContent = '?'
      unknownEl.title = `No fingering defined for ${note.chartKey}`
      cell.appendChild(unknownEl)
    }

    // Position the cell so its center aligns with the VexFlow note head
    cell.style.position = 'absolute'
    cell.style.left = `${noteX - scaledWidth / 2}px`

    container.appendChild(cell)
  })

  // Container needs to be position:relative with enough height for the tallest cell
  // (SVG height is read at build time from the first note's SVG; fall back to known height)
  const firstSVG = container.querySelector('svg')
  const svgH = firstSVG ? parseFloat(firstSVG.getAttribute('height') ?? '46') : 46
  container.style.position = 'relative'
  container.style.height = `${svgH + 24}px`  // SVG height + note label
}
