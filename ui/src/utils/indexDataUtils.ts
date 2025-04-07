import type { StrelkaResponse } from '../services/api.types'

// Constants for index colors
const COLORS = {
  STRELKA: '#9c27b0',
  DEFAULT: '#ff0072',
}

/**
 * Returns the color theme based on the given index.
 *
 * @param index - The index for which the color is to be fetched.
 *
 * @returns A color string.
 */
export const indexColorThemes = (index) => {
  switch (index) {
    case 'strelka':
      return COLORS.STRELKA
    default:
      return COLORS.DEFAULT
  }
}

export interface StrelkaNodeData extends Record<string, unknown> {
  nodeDatatype: string
  nodeVirustotal: string
  nodeInsights: number
  nodeIocs: number
  nodeImage: string
  nodeDisposition: string
  nodeMain: string[]
  nodeSub: string
  nodeTlsh?: string
  nodeLabel: string
  nodeYaraList: string[]
  nodeIocList: string
  nodeMetric: string
  nodeParentId: string
  nodeRelationshipId: string
  nodeDecryptionSuccess: boolean | null
  nodeDepth?: number
  nodeAlert?: boolean
  nodeTlshData?: { family: string }
  nodeMetricLabel?: string
  nodeQrData?: string
  color?: string
  record?: StrelkaResponse
}

/**
 * Transforms raw data into a structured nodeData object based on the index.
 *
 * @param index - The type/index of the data.
 * @param data - The raw data to be transformed.
 *
 * @returns A structured nodeData object.
 */
export const indexDataType = (index, data) => {
  const nodeData: StrelkaNodeData = {
    nodeDatatype: 'strelka',
    nodeVirustotal: 'Not Found',
    nodeInsights: 0,
    nodeIocs: 0,
    nodeImage: '',
    nodeDisposition: '',
    nodeMain: [],
    nodeSub: '',
    nodeTlsh: '',
    nodeLabel: '',
    nodeYaraList: [],
    nodeIocList: '',
    nodeMetric: '',
    nodeParentId: '',
    nodeRelationshipId: '',
    nodeDecryptionSuccess: null,
  }
  let qrData = ''

  if (index === 'strelka') {
    // Check if QR data exists and add to nodeData
    if (data.scan?.qr?.data) {
      qrData = data.scan.qr.data
    }

    // Check if TLSH data exists and add to nodeData
    let tlshData = ''
    if (data.scan?.tlsh?.match) {
      tlshData = data.scan.tlsh.match
    }

    // Check decryption status
    const decryptionSuccess = checkEncryptionStatus(data)

    // Extracting the base64_thumbnail from _any_ scanner, if present
    let base64Thumbnail = ''
    if (data.scan) {
      for (const key in data.scan) {
        if (data.scan[key].base64_thumbnail) {
          base64Thumbnail = data.scan[key].base64_thumbnail
          break
        }
      }
    }

    // Collect mimetypes and yara hits into nodeMain
    const mimetypes = data.file?.flavors?.mime || []
    const yaraHits = data.file?.flavors?.yara || []
    const nodeMain = [...mimetypes, ...yaraHits]

    // Get File IOC Matches
    const iocList = data?.iocs?.map((ioc) => ioc.ioc) || []

    Object.assign(nodeData, {
      nodeDepth: data.file.depth,
      nodeMain: nodeMain,
      nodeSub: `${data.file.size} Bytes`,
      nodeLabel: data.file.name || 'No Filename',
      nodeYaraList: data.scan?.yara?.matches || '',
      nodeMetric: data.scan?.yara?.matches?.length || 0,
      nodeIocList: iocList,
      nodeMetricLabel: 'Yara Matches',
      nodeParentId: data.file.tree.parent,
      nodeRelationshipId: data.file.tree.node,
      nodeVirustotal:
        data.enrichment?.virustotal !== undefined
          ? data.enrichment.virustotal
          : 'Not Found',
      nodeTlshData: tlshData,
      nodeInsights: data?.insights?.length,
      nodeIocs: data?.iocs?.length,
      nodeImage: base64Thumbnail,
      nodeQrData: qrData,
      nodeDecryptionSuccess: decryptionSuccess,
    })
  }

  return nodeData
}

/**
 * Transforms raw data into a structured nodeData object based on the index.
 *
 * @param index - The type/index of the data.
 * @param data - The raw data to be transformed.
 *
 * @returns A structured nodeData object.
 */
export const indexNodeType = (index) => {
  switch (index) {
    case 'strelka':
      return 'event'
    default:
      return 'event'
  }
}

export const checkEncryptionStatus = (data) => {
  const scans = ['encrypted_zip', 'seven_zip', 'rar', 'zip']
  let decryptionFailed = false
  let decryptionSuccessful = false

  for (const scan of scans) {
    if (data.scan?.[scan]) {
      const extracted = data.scan[scan]?.total?.extracted
      const flags = data.scan[scan]?.flags || []

      const timedOut = flags.includes('timed_out')

      if ((extracted === 0 || timedOut) && extracted !== undefined) {
        decryptionFailed = true // Mark decryption as failed if any scan type shows failure
      } else if (extracted > 0 && !timedOut) {
        decryptionSuccessful = true // Mark decryption as successful if any scan type shows success
      }
    }
  }

  if (decryptionSuccessful) {
    return true // Overall decryption is successful if any scan shows success
  }

  if (decryptionFailed) {
    return false // Overall decryption is failed if any scan shows failure
  }

  return null // No relevant data found
}
