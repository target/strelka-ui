import { CollapseCard } from '../../CollapseCard'
import type { OverviewLandingProps } from '../types'
import OcrOverviewCard from './OcrOverviewCard'

const OcrOverviewLanding = (props: OverviewLandingProps) => {
  const { selectedNodeData, expanded, onExpandChange } = props
  if (!selectedNodeData?.scan?.ocr) {
    return null
  }

  const ocrData = selectedNodeData.scan.ocr
  const ocrText = ocrData.text

  let textSummary = 'No Text'
  if (Array.isArray(ocrText)) {
    textSummary = `${ocrText.join(' ').substring(0, 47)}...`
  } else if (typeof ocrText === 'string' && ocrText.length > 0) {
    textSummary = `${ocrText.substring(0, 47)}...`
  }

  let wordsCount = 0
  if (Array.isArray(ocrText)) {
    wordsCount = ocrText.length
  } else if (typeof ocrText === 'string') {
    wordsCount = ocrText.split(' ').length
  }

  const hasPreview = !!ocrData.base64_thumbnail

  const tags = [
    { label: `Words Extracted: ${wordsCount}`, color: 'default' },
    {
      label: hasPreview ? 'Preview Available' : 'No Preview',
      color: hasPreview ? 'success' : 'error',
    },
  ]

  return (
    <CollapseCard
      onExpandChange={onExpandChange}
      label="Optical Character Recognition"
      description={textSummary}
      tags={tags}
      expanded={expanded}
    >
      <OcrOverviewCard data={selectedNodeData} />
    </CollapseCard>
  )
}

export default OcrOverviewLanding
