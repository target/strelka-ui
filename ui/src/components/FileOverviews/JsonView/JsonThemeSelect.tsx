import { Flex, Select } from 'antd'

interface JsonThemeSelectProps {
  jsonTheme: string
  setJsonTheme: (theme: string) => void
}

const JsonThemeSelect = (props: JsonThemeSelectProps) => {
  const { jsonTheme, setJsonTheme } = props
  return (
    <Flex vertical>
      <Select
        popupMatchSelectWidth={false}
        variant="borderless"
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
        onChange={(value) => setJsonTheme(value)}
      />
    </Flex>
  )
}

export default JsonThemeSelect

const themes: string[] = [
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
