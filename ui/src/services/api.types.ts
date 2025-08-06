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
  excludeSubmitters: string[]
  page: number
  pageSize: number
  searchQuery: string
  sortField: string
  sortOrder: string
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
  file_id: string
  file_name: string
  file_size: number
  file: string
  files_seen: number
  hashes: [string, string][]
  id: number
  insights: string[]
  iocs: Ioc[]
  mime_types: string[]
  processed_at: string
  request: ScanRequest
  scan: StrelkaResponse
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
  // S3 fields for file resubmission
  s3_key?: string
  s3_expires_at?: string
}

export interface ScanRequest {
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
  client: string
  id: string
  time: number
}

interface Ioc {
  ioc_type: string
  ioc: string
  scanner: string
}

export interface StrelkaResponse {
  enrichment?: Enrichment
  file: FileDetails
  index?: string
  insights: string[]
  iocs?: Ioc[]
  request: RequestDetails
  scan: ScanDetails
  strelka_response?: StrelkaResponse[]
}

interface Enrichment {
  virustotal?: number
}

interface FileDetails {
  depth: number
  flavors: Flavors
  name: string
  scan: FileScanDetails
  scanners: string[]
  size: number
  source?: string
  tree: Tree
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
  parent?: string
  root: string
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
  files: {
    file_name: string
    file_size: number
    file_type: string
  }[]
  total: {
    files: number
    extracted: number
  }
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
  compression_rate: number
  encrypted: boolean
  file_name: string
  file_size: number
}

interface ScanSevenZip {
  compression_rate: number
  elapsed: number
  files: ScanFiles[]
  flags?: string[]
  host_os: string
  total: {
    files: number
    extracted: number
  }
}

interface ScanPe {
  address_of_entry_point: number
  compile_time: string
  file_info: FileInfo
  header: {
    machine: {
      type: string
      description: string
    }
  }
  sections: Section[]
  security: boolean
  symbols: {
    imported: string[]
    exported: string[]
  }
}

interface FileInfo {
  file_description: string
  file_type: string
  file_version: string
  legal_copyright: string
  original_filename: string
  product_name: string
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
  family: string
  hash: string
  score: number
  tlsh: string
  type: string
}

interface ScanYara {
  elapsed: number
  information: string[]
  matches: string[]
  meta: {
    identifier: string
    rule: string
    value: string
  }
  rules_loaded: number
  tags: string[]
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
  total: {
    files: number
    extracted: number
  }
}

interface ScanEmail {
  attachments: {
    filenames: string[]
  }
  base64_thumbnail: string
  body: string
  date_utc: string
  from: string
  to: string[]
  message_id: string
  received_domain: string[]
  subject: string
  total: {
    attachments: number
  }
}

// File resubmission types
export interface ResubmitRequest {
  description?: string
}

export interface ResubmitResponse {
  file_id: string
  response: StrelkaResponse[]
  original_submission_id: string
  meta: {
    file_size: number
    iocs: string[]
    vt_positives: Array<{ file_sha256: string; positives: number }>
  }
}
