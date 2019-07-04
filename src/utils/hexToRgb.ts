type RGB = {
  r: string,
  g: string,
  b: string
}

export const hexToRgb = (hex: string): RGB | null => {
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i
  hex = hex.replace(shorthandRegex, (_, r, g, b): string => (
    r + r + g + g + b + b
  ))

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: (parseInt(result[1], 16)/255).toFixed(17),
    g: (parseInt(result[2], 16)/255).toFixed(17),
    b: (parseInt(result[3], 16)/255).toFixed(17)
  } : null
}