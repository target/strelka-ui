import { PresetColors } from 'antd/lib/theme/interface/presetColors'

/**
 * Get an Ant Design color name for a given string in a deterministic way.
 * @param input
 * @returns string
 * @description This function generates a hash from the input string and maps it to one of the predefined Ant Design color names.
 */
export const getColorForString = (input: string | string[]): string => {
  if (Array.isArray(input)) {
    return getColorForString(input.join(''))
  }
  if (!input) {
    return 'default'
  }
  let hash = 0
  for (let i = 0; i < input.length; i++) {
    hash = input.charCodeAt(i) + ((hash << 5) - hash)
  }

  const index = Math.abs(hash) % PresetColors.length
  return PresetColors[index]
}
