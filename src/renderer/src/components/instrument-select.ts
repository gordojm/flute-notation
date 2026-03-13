import type { Instrument } from '../instruments/types'
import type { Store } from '../state/store'

export function initInstrumentSelect(
  selectEl: HTMLSelectElement,
  instruments: Instrument[],
  store: Store,
): void {
  // Populate options
  instruments.forEach(inst => {
    const opt = document.createElement('option')
    opt.value = inst.id
    opt.textContent = inst.name
    selectEl.appendChild(opt)
  })

  // Sync initial value
  selectEl.value = store.getState().currentInstrument.id

  // On change, update store
  selectEl.addEventListener('change', () => {
    const inst = instruments.find(i => i.id === selectEl.value)
    if (inst) store.setState({ currentInstrument: inst })
  })

  // Keep in sync if store changes externally
  store.subscribe(state => {
    selectEl.value = state.currentInstrument.id
  })
}
