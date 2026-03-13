const SVG_SCALE = 0.7  // scale down to fit nicely

export function buildFingeringSVG(
  svgTemplate: string,
  activeKeys: string[],
): SVGSVGElement {
  const wrapper = document.createElement('div')
  wrapper.innerHTML = svgTemplate
  const svgEl = wrapper.querySelector('svg') as SVGSVGElement

  // Read native dimensions so this works for any instrument SVG
  const nativeWidth = parseFloat(svgEl.getAttribute('width') ?? '260')
  const nativeHeight = parseFloat(svgEl.getAttribute('height') ?? '74')
  svgEl.setAttribute('width', String(nativeWidth * SVG_SCALE))
  svgEl.setAttribute('height', String(nativeHeight * SVG_SCALE))

  activeKeys.forEach(id => {
    const el = svgEl.querySelector(`#${CSS.escape(id)}`)
    if (el) el.setAttribute('fill', 'black')
  })

  return svgEl
}
