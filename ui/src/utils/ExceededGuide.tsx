import { Card, Typography, theme } from 'antd'

const { Text, Paragraph } = Typography

const ExceededGuide = () => {
  const { useToken } = theme
  const themeData = useToken()

  const glowColor = themeData.token.gold

  return (
    <Card
      styles={{ body: { padding: '10px' } }}
      style={{
        position: 'absolute',
        top: '10px',
        left: '10px',
        marginTop: '155px',
        maxWidth: '250px',
        borderRadius: '5px',
        border: `1px solid ${glowColor}`,
        boxShadow: `0 0 5px ${glowColor}`,
        zIndex: 1000,
        animation: 'glowGold 3s ease-in-out infinite',
      }}
    >
      <Text strong>VirusTotal Submission Limit Reached</Text>
      <Paragraph style={{ margin: 0, fontSize: '12px' }}>
        Some file hashes were not checked against VirusTotal.
      </Paragraph>
    </Card>
  )
}

export default ExceededGuide
