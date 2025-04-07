import { CollapseCard } from '../../CollapseCard'
import type { OverviewLandingProps } from '../types'
import FileHeaderFooterCard from './HeaderFooterCard'

const HeaderFooterLanding = (props: OverviewLandingProps) => {
  const { selectedNodeData, expanded, onExpandChange } = props
  const header = selectedNodeData?.scan?.header
  const footer = selectedNodeData?.scan?.footer

  if (!header || !footer) {
    return null
  }

  const label = 'Header / Footer'
  const description = [`Header: ${header.header}`, `Footer: ${footer.footer}`]

  return (
    <CollapseCard
      onExpandChange={onExpandChange}
      label={label}
      expanded={expanded}
      description={description}
    >
      <FileHeaderFooterCard data={selectedNodeData} />
    </CollapseCard>
  )
}

export default HeaderFooterLanding
