export interface LoginResponse {
  authenticated: boolean
  user_name: string
}

export interface ApiKeyCheckResponse {
  apiKeyAvailable: boolean
}

export interface AuthApiKeyResponse {
  api_key: string
}

export interface StatusResponse {
  message: string
}

export interface MimeTypeStatsResponse {
  [month: string]: {
    [mimeType: string]: number
  }
}

export interface SearchScanOptions {
  searchQuery: string
  page: number
  pageSize: number
  sortField: string
  sortOrder: string
  excludeSubmitters: string[]
}

export interface SearchScanResponse {
  has_next: boolean
  has_prev: boolean
  items: Scan[]
  page: number
  pages: number
  per_page: number
  total: number
}

export interface Scan {
  file: string
  file_id: string
  file_name: string
  file_size: number
  files_seen: number
  hashes: [string, string][]
  id: number
  insights: string[]
  iocs: Ioc[]
  mime_types: string[]
  processed_at: string
  scanners_run: string[]
  strelka_response: StrelkaResponse[]
  submitted_at: string
  submitted_by_user_id: number
  submitted_description: string
  submitted_from_client: string
  submitted_from_ip: string
  submitted_type: string
  user: User
  yara_hits: string[]
  request: ScanRequest
  scan: StrelkaResponse
}

export interface ScanRequest {
  time: number
  client: string
  id: string
  attributes: {
    filename: string
    metadata: {
      client_environment: string
      client_hostname: string
      client_name: string
      client_user_name: string
      client_version: string
      user_name: string
    }
  }
}

interface Ioc {
  ioc: string
  ioc_type: string
  scanner: string
}

export interface StrelkaResponse {
  file: FileDetails
  insights: string[]
  request: RequestDetails
  scan: ScanDetails
  enrichment?: Enrichment
  iocs?: Ioc[]

  strelka_response?: StrelkaResponse[]
}

interface Enrichment {
  virustotal?: number
}

interface FileDetails {
  depth: number
  flavors: Flavors
  name: string
  scanners: string[]
  size: number
  source?: string
  tree: Tree
  scan: FileScanDetails
}

interface FileScanDetails {
  count: number
  files: string[]
  hash: {
    md5: string
  }
}

interface Flavors {
  mime: string[]
  yara?: string[]
}

interface Tree {
  node: string
  root: string
  parent?: string
}

interface RequestDetails {
  attributes: Attributes
  client: string
  id: string
  time: number
}

interface Attributes {
  filename: string
  metadata: Metadata
}

interface Metadata {
  client_environment: string
  client_hostname: string
  client_name: string
  client_user_name: string
  client_version: string
  user_name: string
}

interface ScanDetails {
  email?: ScanEmail
  encrypted_zip?: ScanEncryptedZip
  entropy?: Entropy
  exiftool?: Exiftool
  footer?: Footer
  hash?: Hash
  header?: Header
  javascript?: ScanJavascript
  ocr?: ScanOcr
  pdf?: ScanPdf
  pe?: ScanPe
  qr?: ScanQr
  rar?: ScanRar
  seven_zip?: ScanSevenZip
  tlsh?: ScanTlsh
  vb: ScanVb
  xml?: ScanXml
  yara?: ScanYara
  zip?: ScanZip
}

type ScanZip = {
  compression_rate: number
  elapsed: number
  total: {
    files: number
    extracted: number
  }
  files: {
    file_name: string
    file_size: number
    file_type: string
  }[]
}

interface ScanXml {
  emitted_content: string[]
  doc_type: string
  namespaces: string[]
  tags: string[]
  tag_data: {
    tag: string
    content: string
  }[]
  total: {
    tags: number
    extracted: number
  }
  version: string
}

interface ScanVb {
  script_length_bytes?: number
}

interface ScanJavascript {
  script_length_bytes?: number
}

interface ScanQr {
  data: string[]
}

interface ScanRar {
  compression_rate: number
  host_os: string
  elapsed: number
  flags?: string[]
  files: ScanFiles[]
  total: {
    files: number
    extracted: number
  }
}

interface ScanFiles {
  file_name: string
  file_size: number
  compression_rate: number
  encrypted: boolean
}

interface ScanSevenZip {
  compression_rate: number
  host_os: string
  elapsed: number
  flags?: string[]
  files: ScanFiles[]
  total: {
    files: number
    extracted: number
  }
}

interface ScanPe {
  address_of_entry_point: number
  compile_time: string
  file_info: FileInfo
  sections: Section[]
  security: boolean
  symbols: {
    imported: string[]
    exported: string[]
  }
  header: {
    machine: {
      type: string
      description: string
    }
  }
}

interface FileInfo {
  file_type: string
  product_name: string
  legal_copyright: string
  file_description: string
  original_filename: string
  file_version: string
}

interface Section {
  address: Address
  entropy: number
  md5: string
  name: string
  size: number
}

interface Address {
  physical: number
  virtual: number
}

interface Entropy {
  elapsed: number
  entropy: number
}

interface Exiftool {
  author: string
  createdate: string
  creator: string
  creatortool: string
  directory: string
  documentid: string
  elapsed: number
  exiftoolversion: number
  fileaccessdate: string
  fileinodechangedate: string
  filemodifydate: string
  filename: string
  filepermissions: string
  filesize: string
  filetype: string
  filetypeextension: string
  format: string
  instanceid: string
  linearized: string
  metadatadate: string
  mimetype: string
  modifydate: string
  pagecount: number
  pdfversion: number
  producer: string
  sourcefile: string
  title: string
  warning: string
  xmptoolkit: string
}

interface Footer {
  backslash: string
  elapsed: number
  footer: string
  hex?: string
  raw?: string
}

interface Hash {
  elapsed: number
  md5: string
  sha1: string
  sha256: string
  ssdeep: string
  tlsh: string
}

interface Header {
  backslash: string
  elapsed: number
  header: string
  hex?: string
  raw?: string
}

interface ScanOcr {
  base64_thumbnail: string
  elapsed: number
  render: Render
  text: string[] | string
}

interface Render {
  dpi: number
  format: string
  height: number
  source: string
  width: number
}

interface ScanPdf {
  author: string
  creation_date: string
  creator: string
  dirty: boolean
  elapsed: number
  embedded_files: EmbeddedFiles
  encrypted: boolean
  flags: string[]
  format: string
  images: number
  lines: number
  modify_date: string
  needs_pass: boolean
  objects: Objects
  old_xrefs: boolean
  pages: number
  producer: string
  repaired: boolean
  title: string
  words: number
  xref_object: string[]
}

interface EmbeddedFiles {
  count: number
}

interface Objects {
  mediabox: number
  xobject: number
}

interface ScanTlsh {
  elapsed: number
  match: TlshMatch
}

interface TlshMatch {
  hash: string
  score: number
  type: string
  family: string
  tlsh: string
}

interface ScanYara {
  elapsed: number
  information: string[]
  matches: string[]
  rules_loaded: number
  tags: string[]
  meta: {
    identifier: string
    rule: string
    value: string
  }
}

interface User {
  files_submitted: number
  first_name: string
  id: number
  last_login: string
  last_name: string
  login_count: number
  user_cn: string
}

interface ScanEncryptedZip {
  total: {
    files: number
    extracted: number
  }
  cracked_password: boolean
  elapsed: number
  flags?: string[]
  files: {
    [fileName: string]: {
      file_name: string
      file_size: number
      file_type: string
    }
  }
}

interface ScanEmail {
  subject: string
  base64_thumbnail: string
  total: {
    attachments: number
  }
  attachments: {
    filenames: string[]
  }
  from: string
  to: string[]
  date_utc: string
  message_id: string
  received_domain: string[]
  body: string
}
