import { PresetColors } from 'antd/lib/theme/interface/presetColors'

export const antdColors = {
  blue: '#1890ff',
  purple: '#722ed1',
  magenta: '#eb2f96',
  red: '#ff4d4f',
  volcano: '#fa541c',
  orange: '#fa8c16',
  gold: '#faad14',
  yellow: '#fadb14',
  lime: '#a0d911',
  green: '#52c41a',
  cyan: '#13c2c2',
  geekblue: '#2f54eb',
  gray: '#8c8c8c',
  darkGray: '#595959',
  pink: '#eb2f96',
  brown: '#8D6E63',
  teal: '#009688',
  indigo: '#3F51B5',
  deepPurple: '#673AB7',
  deepOrange: '#FF5722',
  limeGreen: '#CDDC39',
  amber: '#FFC107',
  lightBlue: '#5dafff',
  lightRed: '#ffccc7',
  tealGreen: '#00b2b2',
  lightGreen: '#b7eb8f',
  lightGray: '#d9d9d9',
  darkPurple: '#330099',
  darkGreen: '#389e0d',
  olive: '#808000',
  darkRed: '#8b0000',
  darkBlue: '#00008b',
  violet: '#8A2BE2',
}

export const antdColorNames = PresetColors

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
    return antdColors.darkGray
  }
  let hash = 0
  for (let i = 0; i < input.length; i++) {
    hash = input.charCodeAt(i) + ((hash << 5) - hash)
  }
  const colorKeys = Object.keys(antdColors)
  const index = Math.abs(hash) % colorKeys.length
  return antdColors[colorKeys[index]]
}
