const SVG_WIDTH = 254  // matches transverse-flute.svg viewBox width
const SVG_SCALE = 0.7  // scale down to fit nicely

export function buildFingeringSVG(
  svgTemplate: string,
  activeKeys: string[],
): SVGSVGElement {
  const wrapper = document.createElement('div')
  wrapper.innerHTML = svgTemplate
  const svgEl = wrapper.querySelector('svg') as SVGSVGElement

  // Read native height from the SVG element so this works for any instrument
  const nativeHeight = parseFloat(svgEl.getAttribute('height') ?? '66')
  svgEl.setAttribute('width', String(SVG_WIDTH * SVG_SCALE))
  svgEl.setAttribute('height', String(nativeHeight * SVG_SCALE))

  activeKeys.forEach(id => {
    const el = svgEl.querySelector(`#${CSS.escape(id)}`)
    if (el) el.setAttribute('fill', 'black')
  })

  return svgEl
}
