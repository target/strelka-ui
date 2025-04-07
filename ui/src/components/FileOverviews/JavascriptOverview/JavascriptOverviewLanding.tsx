import { CollapseCard } from '../../CollapseCard'
import type { OverviewLandingProps } from '../types'
import JavascriptOverviewCard from './JavascriptOverviewCard'

const JavascriptOverviewLanding = (props: OverviewLandingProps) => {
  const { selectedNodeData, expanded, onExpandChange } = props
  if (!selectedNodeData?.scan?.javascript) {
    return null
  }

  const jsData = selectedNodeData.scan.javascript
  const scriptLength = jsData.script_length_bytes
    ? `${jsData.script_length_bytes} bytes`
    : '(Length calculation not supported by this release of Strelka)'

  const label = 'JavaScript'
  const description = `Script Length: ${scriptLength}`

  return (
    <CollapseCard
      onExpandChange={onExpandChange}
      label={label}
      description={description}
      expanded={expanded}
    >
      <JavascriptOverviewCard data={selectedNodeData} />
    </CollapseCard>
  )
}

export default JavascriptOverviewLanding
