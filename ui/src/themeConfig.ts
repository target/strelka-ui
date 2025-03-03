import { type ThemeConfig, theme } from 'antd'

export const themeConfig: ThemeConfig = {
  token: {
    borderRadius: 0,
  },
  components: {
    Button: {
      borderRadius: 6,
      borderRadiusSM: 10,
    },
    Table: {
      cellFontSize: 12,
      cellFontSizeMD: 12,
      cellFontSizeSM: 12,
      cellPaddingBlock: 2,
      cellPaddingBlockSM: 2,
    },
  },
  algorithm: theme.defaultAlgorithm,
}
