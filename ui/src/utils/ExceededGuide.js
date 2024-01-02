import React from 'react';
import { Typography } from 'antd';
import { antdColors } from './colors'; 

const { Text, Paragraph } = Typography;

const ExceededGuide = () => {
  return (
    <div style={{
      position: 'absolute',
      top: '10px',
      left: '10px',
      marginTop: "155px",
      backgroundColor: '#ffffff',
      maxWidth: "250px",
      padding: '10px',
      borderRadius: '5px',
      border: `1px solid ${antdColors.gold}`,
      boxShadow: `0 0 5px ${antdColors.gold}`, 
      zIndex: 1000,
      animation: 'glow 3s ease-in-out infinite'
    }}>
      <Text strong>VirusTotal Limit Reached</Text>
      <Paragraph style={{ margin: 0, fontSize: '12px' }}>Some file hashes were not checked against VirusTotal.</Paragraph>
      <style>
        {`
          @keyframes glow {
            0%, 100% {
              box-shadow: 0 0 5px ${antdColors.gold};
            }
            50% {
              box-shadow: 0 0 15px ${antdColors.gold};
            }
          }
        `}
      </style>
    </div>
  );
};

export default ExceededGuide;
