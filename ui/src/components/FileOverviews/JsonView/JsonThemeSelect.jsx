import React from 'react'

import { Select, Typography, Flex } from 'antd'
const { Text } = Typography

const JsonThemeSelect = ({ jsonTheme, setJsonTheme }) => {
  return (
    <Flex vertical>
      <Select
        popupMatchSelectWidth={false}
        size="small"
        style={{
          minWidth: '100px',
        }}
        virtual={false}
        options={themes.map((theme) => ({
          value: theme,
          label: <span>{theme}</span>,
        }))}
        value={jsonTheme}
        onChange={setJsonTheme}
      />
    </Flex>
  )
}

export default JsonThemeSelect

const themes = [
  'apathy',
  'apathy:inverted',
  'ashes',
  'bespin',
  'brewer',
  'bright:inverted',
  'bright',
  'chalk',
  'codeschool',
  'colors',
  'eighties',
  'embers',
  'flat',
  'google',
  'grayscale',
  'grayscale:inverted',
  'greenscreen',
  'harmonic',
  'hopscotch',
  'isotope',
  'marrakesh',
  'mocha',
  'monokai',
  'ocean',
  'paraiso',
  'pop',
  'railscasts',
  'shapeshifter',
  'shapeshifter:inverted',
  'solarized',
  'summerfruit',
  'summerfruit:inverted',
  'threezerotwofour',
  'tomorrow',
  'tube',
  'twilight',
]
