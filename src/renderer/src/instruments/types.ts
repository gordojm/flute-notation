export interface Instrument {
  id: string
  name: string
  svgTemplate: () => string
  fingeringChart: Record<string, string[][]>
}
