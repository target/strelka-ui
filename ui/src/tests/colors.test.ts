import { expect, test } from 'vitest'
import { getColorForString } from '../utils/colors'
import { PresetColors } from 'antd/lib/theme/interface/presetColors'

test('should return a color for a given string', () => {
  const input = 'test'
  const color = getColorForString(input)
  expect(Object.values(PresetColors)).toContain(color)
})

test('should return the same color for the same input string', () => {
  const input = 'consistent'
  const color1 = getColorForString(input)
  const color2 = getColorForString(input)
  expect(color1).toBe(color2)
})

test('should return a color for an empty string', () => {
  const input = ''
  const color = getColorForString(input)
  expect(color).toBe('default')
})

test('should return a color for an array of strings', () => {
  const input = ['array', 'of', 'strings']
  const color = getColorForString(input)
  expect(Object.values(PresetColors)).toContain(color)
})

test('should return the same color for the same array of strings', () => {
  const input = ['same', 'array']
  const color1 = getColorForString(input)
  const color2 = getColorForString(input)
  expect(color1).toBe(color2)
})

test('should return a color for a single-character string', () => {
  const input = 'a'
  const color = getColorForString(input)
  expect(Object.values(PresetColors)).toContain(color)
})

test('should handle special characters in the input string', () => {
  const input = '!@#$%^&*()'
  const color = getColorForString(input)
  expect(Object.values(PresetColors)).toContain(color)
})

test('should handle very long strings', () => {
  const input = 'a'.repeat(1000)
  const color = getColorForString(input)
  expect(Object.values(PresetColors)).toContain(color)
})
