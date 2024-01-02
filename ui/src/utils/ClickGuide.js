import React from 'react';
import { Typography } from 'antd';
import { antdColors } from './colors';

const { Text, Paragraph } = Typography;

const ClickGuide = () => {
  return (
    <div style={{
      position: 'absolute',
      top: '10px',
      left: '10px',
      marginTop: "55px",
      backgroundColor: '#ffffff',
      maxWidth: "250px",
      padding: '10px',
      borderRadius: '5px',
      border: `1px solid ${antdColors.purple}`,
      boxShadow: `0 0 5px ${antdColors.purple}`, 
      zIndex: 1000,
      animation: 'glowPurple 3s ease-in-out infinite'
    }}>
      <Text strong>Select a Node</Text>
      <Paragraph style={{ margin: 0, fontSize: '12px' }}>Filter in File Highlights or click on a node in the diagram to see file details.</Paragraph>
      <style>
        {`
          @keyframes glow {
            0%, 100% {
              box-shadow: 0 0 5px ${antdColors.purple};
            }
            50% {
              box-shadow: 0 0 15px ${antdColors.purple};
            }
          }
        `}
      </style>
    </div>
  );
};

export default ClickGuide;
