import { Collapse, Flex, Tag, Typography } from 'antd'
import type { ReactNode } from 'react'
const { Text } = Typography

interface TagData {
  label: string
  color?: string
}
interface CollapseCardProps {
  label: string
  description?: string | string[]
  children: ReactNode
  tags?: TagData[]
  startExpanded?: boolean
  expanded?: boolean
  onExpandChange?: (expanded: boolean) => void
}

const LABELKEY = '1'

export function CollapseCard(props: CollapseCardProps) {
  const {
    label,
    description,
    children,
    startExpanded,
    expanded,
    onExpandChange,
    tags,
  } = props

  const descriptions = Array.isArray(description)
    ? description
    : [description].filter(Boolean) // filters out falsey values

  const collapseLabel = (
    <Flex justify="space-between" align="center">
      <Flex vertical>
        <Text>{label}</Text>
        {descriptions.map((desc) => (
          <Text key={desc} style={{ fontSize: '12px' }} type="secondary">
            {desc}
          </Text>
        ))}
      </Flex>
      {tags && (
        <Flex>
          {tags.map((tag) => (
            <Tag key={tag.label} color={tag.color || 'default'}>
              {tag.label}
            </Tag>
          ))}
        </Flex>
      )}
    </Flex>
  )

  return (
    <Collapse
      defaultActiveKey={startExpanded ? [LABELKEY] : []}
      activeKey={expanded ? [LABELKEY] : []}
      onChange={(val) => onExpandChange?.(val.length > 0)}
      style={{ width: '100%', marginBottom: '10px' }}
      items={[
        {
          key: LABELKEY,
          label: collapseLabel,
          children: children,
        },
      ]}
    />
  )
}
