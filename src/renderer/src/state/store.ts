import type { Instrument } from '../instruments/types'
import type { SequenceItem } from '../utils/note-parser'

export interface AppState {
  currentInstrument: Instrument
  noteSequence: SequenceItem[]
}

type Listener = (state: AppState) => void

export class Store {
  private state: AppState
  private listeners = new Set<Listener>()

  constructor(initial: AppState) {
    this.state = initial
  }

  getState(): AppState {
    return this.state
  }

  setState(partial: Partial<AppState>): void {
    this.state = { ...this.state, ...partial }
    this.listeners.forEach(fn => fn(this.state))
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }
}
