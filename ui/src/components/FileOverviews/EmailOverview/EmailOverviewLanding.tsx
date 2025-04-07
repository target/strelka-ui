import { CollapseCard } from '../../CollapseCard'
import type { OverviewLandingProps } from '../types'
import EmailOverviewCard from './EmailOverviewCard'

const EmailOverviewLanding = (props: OverviewLandingProps) => {
  const { selectedNodeData, expanded, onExpandChange } = props

  if (!selectedNodeData?.scan?.email) {
    return null
  }

  const emailData = selectedNodeData.scan.email

  let subjectPreview = 'No Subject'
  if (emailData.subject) {
    subjectPreview = `${emailData.subject.substring(0, 47)}${
      emailData.subject.length > 47 ? '...' : ''
    }`
  }

  const label = 'Email'
  const description = subjectPreview
  const tags = [
    {
      label: `Attachments: ${emailData.total?.attachments}`,
      color: 'default',
    },
    {
      label: emailData.base64_thumbnail ? 'Preview Available' : 'No Preview',
      color: emailData.base64_thumbnail ? 'success' : 'error',
    },
  ]

  return (
    <CollapseCard
      onExpandChange={onExpandChange}
      label={label}
      expanded={expanded}
      description={description}
      tags={tags}
    >
      <EmailOverviewCard data={selectedNodeData} />
    </CollapseCard>
  )
}

export default EmailOverviewLanding
