import { Typography, Card, theme } from 'antd'
import React from 'react'
const { Text, Paragraph } = Typography

const ClickGuide = () => {
  const { useToken } = theme
  const themeData = useToken()
  const PURPLE = themeData.token.purple

  return (
    <Card
      styles={{ body: { padding: '10px' } }}
      style={{
        borderRadius: 5,
        position: 'absolute',
        top: '10px',
        left: '10px',
        marginTop: '55px',
        maxWidth: '250px',
        border: `1px solid ${PURPLE}`,
        boxShadow: `0 0 5px ${PURPLE}`,
        zIndex: 1000,
        animation: 'glowPurple 3s ease-in-out infinite',
      }}
    >
      <Text strong>Select a Node</Text>
      <Paragraph style={{ margin: 0, fontSize: '12px' }}>
        Filter in File Highlights or click on a node in the diagram to see file
        details.
      </Paragraph>
      <style>
        {`
      
        `}
      </style>
    </Card>
  )
}

export default ClickGuide
