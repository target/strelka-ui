import {
  CalculatorOutlined,
  CodeOutlined,
  DatabaseOutlined,
  ExperimentOutlined,
  FileExcelOutlined,
  FileGifOutlined,
  FileImageOutlined,
  FileMarkdownOutlined,
  FileOutlined,
  FilePdfOutlined,
  FileTextOutlined,
  FileUnknownOutlined,
  FileWordOutlined,
  FileZipOutlined,
  GlobalOutlined,
  Html5Outlined,
  LinkOutlined,
  LockOutlined,
  MailOutlined,
  NumberOutlined,
  PictureOutlined,
  PlaySquareOutlined,
  SafetyCertificateOutlined,
  TableOutlined,
} from '@ant-design/icons'

import * as colors from '@ant-design/colors'
import { useCallback, useMemo } from 'react'

import { theme } from 'antd'
const { useToken } = theme

//import { antdColors } from './colors'

// // Default icon and color
// const defaultIconConfig = {
//   icon: FileTextOutlined,
//   color: darkGray,
// }

// // Function to get icon configuration
// export const getIconConfig = (category, type) => {
//   if (flowIconMappingTable[category]?.[type]) {
//     return flowIconMappingTable[category][type]
//   }
//   return defaultIconConfig
// }

const GRAY = colors.gray[7]
const DARK_GRAY = colors.gray[5]

export const useIconConfig = () => {
  const { token } = useToken()

  const flowIconMappingTable = useMemo(
    () => ({
      defaultIcon: {
        icon: FileTextOutlined,
        color: DARK_GRAY,
        name: 'default',
      },
      // -----------
      // YARA Types
      // -----------
      archive: {
        icon: FileZipOutlined,
        color: token.gold,
        name: 'gold',
      },
      audio: {
        icon: PlaySquareOutlined,
        color: token.green,
        name: 'green',
      },
      capture: {
        icon: DatabaseOutlined,
        color: token.geekblue,
        name: 'geekblue',
      },
      certificate: {
        icon: LockOutlined,
        color: token.cyan,
        name: 'cyan',
      },
      compressed: {
        icon: FileZipOutlined,
        color: token.orange,
        name: 'orange',
      },
      document: {
        icon: FileTextOutlined,
        color: token.blue,
        name: 'blue',
      },
      email: {
        icon: MailOutlined,
        color: token.purple,
        name: 'purple',
      },
      encoded: {
        icon: CodeOutlined,
        color: token.orange,
        name: 'orange',
      },
      executable: {
        icon: PlaySquareOutlined,
        color: token.red,
        name: 'red',
      },
      image: {
        icon: PictureOutlined,
        color: token.gold,
        name: 'gold',
      },
      metadata: {
        icon: TableOutlined,
        color: token.lime,
        name: 'lime',
      },
      multimedia: {
        icon: PlaySquareOutlined,
        color: token.purple,
        name: 'purple',
      },
      package: {
        icon: FileZipOutlined,
        color: token.gold,
        name: 'gold',
      },
      script: {
        icon: CodeOutlined,
        color: token.cyan,
        name: 'cyan',
      },
      text: {
        icon: FileTextOutlined,
        color: DARK_GRAY,
        name: 'default',
      },
      video: {
        icon: PlaySquareOutlined,
        color: token.magenta,
        name: 'magenta',
      },
      PII: {
        icon: LockOutlined,
        color: token.cyan,
        name: 'cyan',
      },
      '7zip_file': {
        icon: FileZipOutlined,
        color: token.gold,
        name: 'gold',
      },
      arj_file: {
        icon: FileZipOutlined,
        color: token.gold,
        name: 'gold',
      },
      cab_file: {
        icon: FileZipOutlined,
        color: token.gold,
        name: 'gold',
      },
      cpio_file: {
        icon: FileZipOutlined,
        color: token.gold,
        name: 'gold',
      },
      dmg_disk_image: {
        icon: FileZipOutlined,
        color: token.gold,
        name: 'gold',
      },
      dmg_encrypted_disk_image: {
        icon: FileZipOutlined,
        color: token.gold,
        name: 'gold',
      },
      encrypted_zip: {
        icon: FileZipOutlined,
        color: token.gold,
        name: 'gold',
      },
      encrypted_word_document: {
        icon: FileWordOutlined,
        color: token.geekblue,
        name: 'geekblue',
      },
      hfsplus_disk_image: {
        icon: FileZipOutlined,
        color: token.gold,
        name: 'gold',
      },
      iso_file: {
        icon: FileZipOutlined,
        color: token.gold,
        name: 'gold',
      },
      mhtml_file: {
        icon: FileTextOutlined,
        color: token.blue,
        name: 'blue',
      },
      rar_file: {
        icon: FileZipOutlined,
        color: token.gold,
        name: 'gold',
      },
      tar_file: {
        icon: FileZipOutlined,
        color: token.gold,
        name: 'gold',
      },
      udf_file: {
        icon: FileZipOutlined,
        color: token.gold,
        name: 'gold',
      },
      vhd_file: {
        icon: FileZipOutlined,
        color: token.gold,
        name: 'gold',
      },
      vhdx_file: {
        icon: FileZipOutlined,
        color: token.gold,
        name: 'gold',
      },
      xar_file: {
        icon: FileZipOutlined,
        color: token.gold,
        name: 'gold',
      },
      zip_file: {
        icon: FileZipOutlined,
        color: token.gold,
        name: 'gold',
      },
      mp3_file: {
        icon: PlaySquareOutlined,
        color: token.green,
        name: 'green',
      },
      pcap_file: {
        icon: DatabaseOutlined,
        color: token.geekblue,
        name: 'geekblue',
      },
      pcapng_file: {
        icon: DatabaseOutlined,
        color: token.geekblue,
        name: 'geekblue',
      },
      pkcs7_file: {
        icon: LockOutlined,
        color: token.cyan,
        name: 'cyan',
      },
      x509_der_file: {
        icon: LockOutlined,
        color: token.cyan,
        name: 'cyan',
      },
      x509_pem_file: {
        icon: LockOutlined,
        color: token.cyan,
        name: 'cyan',
      },
      bzip2_file: {
        icon: FileZipOutlined,
        color: token.orange,
        name: 'orange',
      },
      gzip_file: {
        icon: FileZipOutlined,
        color: token.orange,
        name: 'orange',
      },
      lzma_file: {
        icon: FileZipOutlined,
        color: token.orange,
        name: 'orange',
      },
      xz_file: {
        icon: FileZipOutlined,
        color: token.orange,
        name: 'orange',
      },
      zlib_file: {
        icon: FileZipOutlined,
        color: token.orange,
        name: 'orange',
      },
      doc_subheader_file: {
        icon: FileWordOutlined,
        color: token.geekblue,
        name: 'geekblue',
      },
      excel4_file: {
        icon: FileExcelOutlined,
        color: token.green,
        name: 'green',
      },
      iqy_file: {
        icon: FileExcelOutlined,
        color: token.green,
        name: 'green',
      },
      onenote_file: {
        icon: FileWordOutlined,
        color: token.purple,
        name: 'purple',
      },
      mso_file: {
        icon: FileTextOutlined,
        color: token.blue,
        name: 'blue',
      },
      olecf_file: {
        icon: FileTextOutlined,
        color: DARK_GRAY,
        name: 'default',
      },
      ooxml_file: {
        icon: FileTextOutlined,
        color: token.blue,
        name: 'blue',
      },
      pdf_file: {
        icon: FilePdfOutlined,
        color: token.red,
        name: 'red',
      },
      poi_hpbf_file: {
        icon: FileTextOutlined,
        color: token.blue,
        name: 'blue',
      },
      rtf_file: {
        icon: FileTextOutlined,
        color: token.blue,
        name: 'blue',
      },
      vbframe_file: {
        icon: CodeOutlined,
        color: token.orange,
        name: 'orange',
      },
      wordml_file: {
        icon: FileWordOutlined,
        color: token.geekblue,
        name: 'geekblue',
      },
      xfdf_file: {
        icon: FileTextOutlined,
        color: DARK_GRAY,
        name: 'default',
      },
      email_file: {
        icon: MailOutlined,
        color: token.purple,
        name: 'purple',
      },
      tnef_file: {
        icon: FileTextOutlined,
        color: DARK_GRAY,
        name: 'default',
      },
      base64_pe: {
        icon: CodeOutlined,
        color: token.orange,
        name: 'orange',
      },
      pgp_file: {
        icon: LockOutlined,
        color: token.cyan,
        name: 'cyan',
      },
      elf_file: {
        icon: PlaySquareOutlined,
        color: token.red,
        name: 'red',
      },
      lnk_file: {
        icon: FileOutlined,
        color: DARK_GRAY,
        name: 'default',
      },
      macho_file: {
        icon: PlaySquareOutlined,
        color: token.red,
        name: 'red',
      },
      mz_file: {
        icon: PlaySquareOutlined,
        color: token.red,
        name: 'red',
      },
      bmp_file: {
        icon: PictureOutlined,
        color: token.blue,
        name: 'blue',
      },
      cmap_file: {
        icon: FileTextOutlined,
        color: DARK_GRAY,
        name: 'default',
      },
      gif_file: {
        icon: FileGifOutlined,
        color: token.blue,
        name: 'blue',
      },
      jpeg_file: {
        icon: PictureOutlined,
        color: token.blue,
        name: 'blue',
      },
      postscript_file: {
        icon: FileTextOutlined,
        color: token.blue,
        name: 'blue',
      },
      png_file: {
        icon: PictureOutlined,
        color: token.blue,
        name: 'blue',
      },
      psd_file: {
        icon: FileImageOutlined,
        color: token.green,
        name: 'green',
      },
      psd_image_file: {
        icon: FileImageOutlined,
        color: token.green,
        name: 'green',
      },
      svg_file: {
        icon: FileImageOutlined,
        color: token.green,
        name: 'green',
      },
      xicc_file: {
        icon: FileTextOutlined,
        color: DARK_GRAY,
        name: 'default',
      },
      xmp_file: {
        icon: FileTextOutlined,
        color: DARK_GRAY,
        name: 'default',
      },
      jar_manifest_file: {
        icon: FileTextOutlined,
        color: DARK_GRAY,
        name: 'default',
      },
      bplist_file: {
        icon: FileTextOutlined,
        color: DARK_GRAY,
        name: 'default',
      },
      fws_file: {
        icon: PlaySquareOutlined,
        color: token.purple,
        name: 'purple',
      },
      cws_file: {
        icon: PlaySquareOutlined,
        color: token.purple,
        name: 'purple',
      },
      zws_file: {
        icon: PlaySquareOutlined,
        color: token.purple,
        name: 'purple',
      },
      debian_package_file: {
        icon: FileZipOutlined,
        color: token.gold,
        name: 'gold',
      },
      rpm_file: {
        icon: FileZipOutlined,
        color: token.gold,
        name: 'gold',
      },
      hacktool_win_shellcode_donut: {
        icon: CodeOutlined,
        color: token.orange,
        name: 'orange',
      },
      upx_file: {
        icon: FileZipOutlined,
        color: token.orange,
        name: 'orange',
      },
      batch_file: {
        icon: CodeOutlined,
        color: token.orange,
        name: 'orange',
      },
      javascript_file: {
        icon: CodeOutlined,
        color: token.orange,
        name: 'orange',
      },
      vb_file: {
        icon: CodeOutlined,
        color: token.orange,
        name: 'orange',
      },
      hta_file: {
        icon: CodeOutlined,
        color: token.red,
        name: 'red',
      },
      html_file: {
        icon: Html5Outlined,
        color: token.purple,
        name: 'purple',
      },
      ini_file: {
        icon: FileTextOutlined,
        color: DARK_GRAY,
        name: 'default',
      },
      json_file: {
        icon: FileOutlined,
        color: token.purple,
        name: 'purple',
      },
      php_file: {
        icon: CodeOutlined,
        color: token.orange,
        name: 'orange',
      },
      plist_file: {
        icon: FileTextOutlined,
        color: DARK_GRAY,
        name: 'default',
      },
      soap_file: {
        icon: FileTextOutlined,
        color: token.blue,
        name: 'blue',
      },
      xml_file: {
        icon: FileTextOutlined,
        color: token.blue,
        name: 'blue',
      },
      avi_file: {
        icon: PlaySquareOutlined,
        color: token.red,
        name: 'red',
      },
      wmv_file: {
        icon: PlaySquareOutlined,
        color: token.red,
        name: 'red',
      },
      credit_cards: {
        icon: LockOutlined,
        color: token.cyan,
        name: 'cyan',
      },
      vsto_file: {
        icon: FileTextOutlined,
        color: token.blue,
        name: 'blue',
      },
      // -----------
      // Mime Types (Overridden by YARA Type, if exists)
      // -----------
      'application/octet-stream': {
        icon: NumberOutlined,
        color: token.gold,
        name: 'gold',
      },
      'text/plain': {
        icon: FileTextOutlined,
        color: GRAY,
      },
      'text/html': {
        icon: Html5Outlined,
        color: token.purple,
        name: 'purple',
      },
      'text/csv': {
        icon: TableOutlined,
        color: token.lime,
        name: 'lime',
      },
      'image/png': {
        icon: PictureOutlined,
        color: token.blue,
        name: 'blue',
      },
      'image/jpeg': {
        icon: PictureOutlined,
        color: token.blue,
        name: 'blue',
      },
      'application/pdf': {
        icon: FilePdfOutlined,
        color: token.red,
        name: 'red',
      },
      'text/xml': {
        icon: FileTextOutlined,
        color: token.orange,
        name: 'orange',
      },
      'application/x-executable': {
        icon: PlaySquareOutlined,
        color: token.red,
        name: 'red',
      },
      'application/zip': {
        icon: FileZipOutlined,
        color: token.gold,
        name: 'gold',
      },
      'application/vnd.ms-excel': {
        icon: FileExcelOutlined,
        color: token.green,
        name: 'green',
      },
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': {
        icon: FileExcelOutlined,
        color: token.green,
        name: 'green',
      },
      'application/msword': {
        icon: FileWordOutlined,
        color: token.geekblue,
        name: 'geekblue',
      },
      'application/x-dosexec': {
        icon: PlaySquareOutlined,
        color: token.red,
        name: 'red',
      },
      'application/x-dbt': {
        icon: DatabaseOutlined,
        color: token.purple,
        name: 'purple',
      },
      'application/encrypted': {
        icon: LockOutlined,
        color: token.cyan,
        name: 'cyan',
      },
      'application/x-matlab-data': {
        icon: CalculatorOutlined,
        color: token.yellow,
        name: 'yellow',
      },
      'application/x-pnf': {
        icon: FileOutlined,
        color: token.gold,
        name: 'gold',
      },
      'application/x-empty': {
        icon: FileUnknownOutlined,
        color: GRAY,
      },
      'application/cdfv2': {
        icon: FileTextOutlined,
        color: GRAY,
      },
      'application/gzip': {
        icon: FileZipOutlined,
        color: token.gold,
        name: 'gold',
      },
      'image/svg+xml': {
        icon: FileImageOutlined,
        color: token.green,
        name: 'green',
      },
      'message/rfc822': {
        icon: MailOutlined,
        color: token.blue,
        name: 'blue',
      },
      'text/rtf': {
        icon: FileWordOutlined,
        color: token.green,
        name: 'green',
      },
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        {
          icon: FileWordOutlined,
          color: token.green,
          name: 'green',
        },
      'application/x-wine-extension-ini': {
        icon: ExperimentOutlined,
        color: token.magenta,
        name: 'magenta',
      },
      'application/x-setupscript': {
        icon: CodeOutlined,
        color: token.cyan,
        name: 'cyan',
      },
      'text/css': {
        icon: CodeOutlined,
        color: token.cyan,
        name: 'cyan',
      },
      'application/json': {
        icon: FileOutlined,
        color: token.purple,
        name: 'purple',
      },
      'application/xml': {
        icon: FileOutlined,
        color: token.purple,
        name: 'purple',
      },
      'application/javascript': {
        icon: CodeOutlined,
        color: token.orange,
        name: 'orange',
      },
      'text/markdown': {
        icon: FileMarkdownOutlined,
        color: token.lime,
        name: 'lime',
      },
      'image/gif': {
        icon: FileGifOutlined,
        color: token.gold,
        name: 'gold',
      },
      domain: {
        icon: GlobalOutlined,
        color: token.blue,
        name: 'blue',
      },
      url: {
        icon: LinkOutlined,
        color: token.geekblue,
        name: 'geekblue',
      },
      md5: {
        icon: SafetyCertificateOutlined,
        color: token.purple5,
        name: 'purple',
      },
      sha1: {
        icon: SafetyCertificateOutlined,
        color: token.purple,
        name: 'purple',
      },
      sha256: {
        icon: SafetyCertificateOutlined,
        color: token.purple,
        name: 'purple',
      },
      ip: {
        icon: NumberOutlined,
        color: token.orange,
        name: 'orange',
      },
    }),
    [token],
  )

  // Function to get icon configuration
  const getIconConfig = useCallback(
    (category, type) => {
      if (category !== 'strelka') {
        return flowIconMappingTable.defaultIcon
      }

      const iconConfig =
        flowIconMappingTable[type] || flowIconMappingTable.defaultIcon
      return iconConfig
    },
    [flowIconMappingTable],
  )

  return {
    getIconConfig,
    icons: flowIconMappingTable,
  }
}
