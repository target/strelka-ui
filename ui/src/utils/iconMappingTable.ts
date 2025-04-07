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

import { antdColors } from './colors'

export const flowIconMappingTable = {
  strelka: {
    // -----------
    // YARA Types
    // -----------
    archive: {
      icon: FileZipOutlined,
      color: antdColors.gold,
    },
    audio: {
      icon: PlaySquareOutlined,
      color: antdColors.green,
    },
    capture: {
      icon: DatabaseOutlined,
      color: antdColors.geekblue,
    },
    certificate: {
      icon: LockOutlined,
      color: antdColors.cyan,
    },
    compressed: {
      icon: FileZipOutlined,
      color: antdColors.orange,
    },
    document: {
      icon: FileTextOutlined,
      color: antdColors.blue,
    },
    email: {
      icon: MailOutlined,
      color: antdColors.indigo,
    },
    encoded: {
      icon: CodeOutlined,
      color: antdColors.deepOrange,
    },
    executable: {
      icon: PlaySquareOutlined,
      color: antdColors.red,
    },
    image: {
      icon: PictureOutlined,
      color: antdColors.amber,
    },
    metadata: {
      icon: TableOutlined,
      color: antdColors.lime,
    },
    multimedia: {
      icon: PlaySquareOutlined,
      color: antdColors.purple,
    },
    package: {
      icon: FileZipOutlined,
      color: antdColors.gold,
    },
    script: {
      icon: CodeOutlined,
      color: antdColors.teal,
    },
    text: {
      icon: FileTextOutlined,
      color: antdColors.darkGray,
    },
    video: {
      icon: PlaySquareOutlined,
      color: antdColors.magenta,
    },
    PII: {
      icon: LockOutlined,
      color: antdColors.cyan,
    },
    '7zip_file': {
      icon: FileZipOutlined,
      color: antdColors.gold,
    },
    arj_file: {
      icon: FileZipOutlined,
      color: antdColors.gold,
    },
    cab_file: {
      icon: FileZipOutlined,
      color: antdColors.gold,
    },
    cpio_file: {
      icon: FileZipOutlined,
      color: antdColors.gold,
    },
    dmg_disk_image: {
      icon: FileZipOutlined,
      color: antdColors.gold,
    },
    dmg_encrypted_disk_image: {
      icon: FileZipOutlined,
      color: antdColors.gold,
    },
    encrypted_zip: {
      icon: FileZipOutlined,
      color: antdColors.gold,
    },
    encrypted_word_document: {
      icon: FileWordOutlined,
      color: antdColors.geekblue,
    },
    hfsplus_disk_image: {
      icon: FileZipOutlined,
      color: antdColors.gold,
    },
    iso_file: {
      icon: FileZipOutlined,
      color: antdColors.gold,
    },
    mhtml_file: {
      icon: FileTextOutlined,
      color: antdColors.blue,
    },
    rar_file: {
      icon: FileZipOutlined,
      color: antdColors.gold,
    },
    tar_file: {
      icon: FileZipOutlined,
      color: antdColors.gold,
    },
    udf_file: {
      icon: FileZipOutlined,
      color: antdColors.gold,
    },
    vhd_file: {
      icon: FileZipOutlined,
      color: antdColors.gold,
    },
    vhdx_file: {
      icon: FileZipOutlined,
      color: antdColors.gold,
    },
    xar_file: {
      icon: FileZipOutlined,
      color: antdColors.gold,
    },
    zip_file: {
      icon: FileZipOutlined,
      color: antdColors.gold,
    },
    mp3_file: {
      icon: PlaySquareOutlined,
      color: antdColors.green,
    },
    pcap_file: {
      icon: DatabaseOutlined,
      color: antdColors.geekblue,
    },
    pcapng_file: {
      icon: DatabaseOutlined,
      color: antdColors.geekblue,
    },
    pkcs7_file: {
      icon: LockOutlined,
      color: antdColors.cyan,
    },
    x509_der_file: {
      icon: LockOutlined,
      color: antdColors.cyan,
    },
    x509_pem_file: {
      icon: LockOutlined,
      color: antdColors.cyan,
    },
    bzip2_file: {
      icon: FileZipOutlined,
      color: antdColors.orange,
    },
    gzip_file: {
      icon: FileZipOutlined,
      color: antdColors.orange,
    },
    lzma_file: {
      icon: FileZipOutlined,
      color: antdColors.orange,
    },
    xz_file: {
      icon: FileZipOutlined,
      color: antdColors.orange,
    },
    zlib_file: {
      icon: FileZipOutlined,
      color: antdColors.orange,
    },
    doc_subheader_file: {
      icon: FileWordOutlined,
      color: antdColors.geekblue,
    },
    excel4_file: {
      icon: FileExcelOutlined,
      color: antdColors.green,
    },
    iqy_file: {
      icon: FileExcelOutlined,
      color: antdColors.green,
    },
    onenote_file: {
      icon: FileWordOutlined,
      color: antdColors.purple,
    },
    mso_file: {
      icon: FileTextOutlined,
      color: antdColors.blue,
    },
    olecf_file: {
      icon: FileTextOutlined,
      color: antdColors.darkGray,
    },
    ooxml_file: {
      icon: FileTextOutlined,
      color: antdColors.blue,
    },
    pdf_file: {
      icon: FilePdfOutlined,
      color: antdColors.red,
    },
    poi_hpbf_file: {
      icon: FileTextOutlined,
      color: antdColors.blue,
    },
    rtf_file: {
      icon: FileTextOutlined,
      color: antdColors.blue,
    },
    vbframe_file: {
      icon: CodeOutlined,
      color: antdColors.deepOrange,
    },
    wordml_file: {
      icon: FileWordOutlined,
      color: antdColors.geekblue,
    },
    xfdf_file: {
      icon: FileTextOutlined,
      color: antdColors.darkGray,
    },
    email_file: {
      icon: MailOutlined,
      color: antdColors.indigo,
    },
    tnef_file: {
      icon: FileTextOutlined,
      color: antdColors.darkGray,
    },
    base64_pe: {
      icon: CodeOutlined,
      color: antdColors.deepOrange,
    },
    pgp_file: {
      icon: LockOutlined,
      color: antdColors.cyan,
    },
    elf_file: {
      icon: PlaySquareOutlined,
      color: antdColors.red,
    },
    lnk_file: {
      icon: FileOutlined,
      color: antdColors.darkGray,
    },
    macho_file: {
      icon: PlaySquareOutlined,
      color: antdColors.red,
    },
    mz_file: {
      icon: PlaySquareOutlined,
      color: antdColors.red,
    },
    bmp_file: {
      icon: PictureOutlined,
      color: antdColors.blue,
    },
    cmap_file: {
      icon: FileTextOutlined,
      color: antdColors.darkGray,
    },
    gif_file: {
      icon: FileGifOutlined,
      color: antdColors.blue,
    },
    jpeg_file: {
      icon: PictureOutlined,
      color: antdColors.blue,
    },
    postscript_file: {
      icon: FileTextOutlined,
      color: antdColors.blue,
    },
    png_file: {
      icon: PictureOutlined,
      color: antdColors.blue,
    },
    psd_file: {
      icon: FileImageOutlined,
      color: antdColors.green,
    },
    psd_image_file: {
      icon: FileImageOutlined,
      color: antdColors.green,
    },
    svg_file: {
      icon: FileImageOutlined,
      color: antdColors.green,
    },
    xicc_file: {
      icon: FileTextOutlined,
      color: antdColors.darkGray,
    },
    xmp_file: {
      icon: FileTextOutlined,
      color: antdColors.darkGray,
    },
    jar_manifest_file: {
      icon: FileTextOutlined,
      color: antdColors.darkGray,
    },
    bplist_file: {
      icon: FileTextOutlined,
      color: antdColors.darkGray,
    },
    fws_file: {
      icon: PlaySquareOutlined,
      color: antdColors.purple,
    },
    cws_file: {
      icon: PlaySquareOutlined,
      color: antdColors.purple,
    },
    zws_file: {
      icon: PlaySquareOutlined,
      color: antdColors.purple,
    },
    debian_package_file: {
      icon: FileZipOutlined,
      color: antdColors.gold,
    },
    rpm_file: {
      icon: FileZipOutlined,
      color: antdColors.gold,
    },
    hacktool_win_shellcode_donut: {
      icon: CodeOutlined,
      color: antdColors.deepOrange,
    },
    upx_file: {
      icon: FileZipOutlined,
      color: antdColors.orange,
    },
    batch_file: {
      icon: CodeOutlined,
      color: antdColors.deepOrange,
    },
    javascript_file: {
      icon: CodeOutlined,
      color: antdColors.deepOrange,
    },
    vb_file: {
      icon: CodeOutlined,
      color: antdColors.deepOrange,
    },
    hta_file: {
      icon: CodeOutlined,
      color: antdColors.red,
    },
    html_file: {
      icon: Html5Outlined,
      color: antdColors.purple,
    },
    ini_file: {
      icon: FileTextOutlined,
      color: antdColors.darkGray,
    },
    json_file: {
      icon: FileOutlined,
      color: antdColors.indigo,
    },
    php_file: {
      icon: CodeOutlined,
      color: antdColors.deepOrange,
    },
    plist_file: {
      icon: FileTextOutlined,
      color: antdColors.darkGray,
    },
    soap_file: {
      icon: FileTextOutlined,
      color: antdColors.blue,
    },
    xml_file: {
      icon: FileTextOutlined,
      color: antdColors.blue,
    },
    avi_file: {
      icon: PlaySquareOutlined,
      color: antdColors.red,
    },
    wmv_file: {
      icon: PlaySquareOutlined,
      color: antdColors.red,
    },
    credit_cards: {
      icon: LockOutlined,
      color: antdColors.cyan,
    },
    vsto_file: {
      icon: FileTextOutlined,
      color: antdColors.blue,
    },
    // -----------
    // Mime Types (Overridden by YARA Type, if exists)
    // -----------
    'application/octet-stream': {
      icon: NumberOutlined,
      color: antdColors.brown,
    },
    'text/plain': {
      icon: FileTextOutlined,
      color: antdColors.gray,
    },
    'text/html': {
      icon: Html5Outlined,
      color: antdColors.purple,
    },
    'text/csv': {
      icon: TableOutlined,
      color: antdColors.lime,
    },
    'image/png': {
      icon: PictureOutlined,
      color: antdColors.blue,
    },
    'image/jpeg': {
      icon: PictureOutlined,
      color: antdColors.blue,
    },
    'application/pdf': {
      icon: FilePdfOutlined,
      color: antdColors.red,
    },
    'text/xml': {
      icon: FileTextOutlined,
      color: antdColors.orange,
    },
    'application/x-executable': {
      icon: PlaySquareOutlined,
      color: antdColors.red,
    },
    'application/zip': {
      icon: FileZipOutlined,
      color: antdColors.gold,
    },
    'application/vnd.ms-excel': {
      icon: FileExcelOutlined,
      color: antdColors.green,
    },
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': {
      icon: FileExcelOutlined,
      color: antdColors.green,
    },
    'application/msword': {
      icon: FileWordOutlined,
      color: antdColors.geekblue,
    },
    'application/x-dosexec': {
      icon: PlaySquareOutlined,
      color: antdColors.red,
    },
    'application/x-dbt': {
      icon: DatabaseOutlined,
      color: antdColors.purple,
    },
    'application/encrypted': {
      icon: LockOutlined,
      color: antdColors.cyan,
    },
    'application/x-matlab-data': {
      icon: CalculatorOutlined,
      color: antdColors.yellow,
    },
    'application/x-pnf': {
      icon: FileOutlined,
      color: antdColors.gold,
    },
    'application/x-empty': {
      icon: FileUnknownOutlined,
      color: antdColors.gray,
    },
    'application/cdfv2': {
      icon: FileTextOutlined,
      color: antdColors.gray,
    },
    'application/gzip': {
      icon: FileZipOutlined,
      color: antdColors.gold,
    },
    'image/svg+xml': {
      icon: FileImageOutlined,
      color: antdColors.green,
    },
    'message/rfc822': {
      icon: MailOutlined,
      color: antdColors.blue,
    },
    'text/rtf': {
      icon: FileWordOutlined,
      color: antdColors.green,
    },
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': {
      icon: FileWordOutlined,
      color: antdColors.green,
    },
    'application/x-wine-extension-ini': {
      icon: ExperimentOutlined,
      color: antdColors.magenta,
    },
    'application/x-setupscript': {
      icon: CodeOutlined,
      color: antdColors.cyan,
    },
    'text/css': {
      icon: CodeOutlined,
      color: antdColors.teal,
    },
    'application/json': {
      icon: FileOutlined,
      color: antdColors.indigo,
    },
    'application/xml': {
      icon: FileOutlined,
      color: antdColors.deepPurple,
    },
    'application/javascript': {
      icon: CodeOutlined,
      color: antdColors.deepOrange,
    },
    'text/markdown': {
      icon: FileMarkdownOutlined,
      color: antdColors.limeGreen,
    },
    'image/gif': {
      icon: FileGifOutlined,
      color: antdColors.amber,
    },
    domain: {
      icon: GlobalOutlined,
      color: antdColors.blue,
    },
    url: {
      icon: LinkOutlined,
      color: antdColors.geekblue,
    },
    md5: {
      icon: SafetyCertificateOutlined,
      color: antdColors.violet,
    },
    sha1: {
      icon: SafetyCertificateOutlined,
      color: antdColors.purple,
    },
    sha256: {
      icon: SafetyCertificateOutlined,
      color: antdColors.indigo,
    },
    ip: {
      icon: NumberOutlined,
      color: antdColors.orange,
    },
  },
}

// Default icon and color
const defaultIconConfig = {
  icon: FileTextOutlined,
  color: antdColors.darkGray,
}

// Function to get icon configuration
export const getIconConfig = (category, type) => {
  if (flowIconMappingTable[category]?.[type]) {
    return flowIconMappingTable[category][type]
  }
  return defaultIconConfig
}
