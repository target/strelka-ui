import { Alert, List, Typography } from 'antd'
import React from 'react'

const { Text } = Typography

const InsightsCard = ({ data }) => {
  // Conditional styling based on whether there are insights
  const cardStyle =
    data?.length === 0
      ? {
          maxHeight: '200px',
          overflowY: 'auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }
      : {
          maxHeight: '200px',
          overflowY: 'auto',
        }

  return (
    <div style={cardStyle}>
      {data?.length > 0 ? (
        <List
          dataSource={data}
          renderItem={(item) => (
            <List.Item style={{ borderBottom: 'none', padding: '4px' }}>
              <Alert
                style={{ width: '100%', fontSize: '12px' }}
                message={item}
                type="warning"
                showIcon
              />
            </List.Item>
          )}
        />
      ) : (
        <Text>No Insights For This File</Text>
      )}
    </div>
  )
}

export default InsightsCard
