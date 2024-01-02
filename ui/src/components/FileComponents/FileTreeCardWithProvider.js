import React from 'react';
import { ReactFlowProvider } from 'reactflow';
import FileTreeCard from './FileTreeCard'; // Adjust the import path as needed

function FileTreeCardWithProvider(props) {
  return (
    <ReactFlowProvider>
      <FileTreeCard {...props} />
    </ReactFlowProvider>
  );
}

export default FileTreeCardWithProvider;
