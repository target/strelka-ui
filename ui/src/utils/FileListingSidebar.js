import React from 'react';

const FileListingSidebarContent = ({ nodes }) => {
  // Create a map where each key is a mimetype and the value is an array of filenames
  const filesByMimetype = nodes.reduce((acc, node) => {
    const mimetype = node.data.nodeMain || 'Other';
    const filename = node.data.nodeLabel;

    if (!acc[mimetype]) {
      acc[mimetype] = [];
    }

    acc[mimetype].push(filename);
    return acc;
  }, {});

  // Sort mimetypes
  const sortedMimetypes = Object.keys(filesByMimetype).sort();

  return (
    <div>
      {sortedMimetypes.map((mimetype) => (
        <React.Fragment key={mimetype}>
          <h4>{mimetype}</h4>
          <ul>
            {filesByMimetype[mimetype].sort().map((filename, index) => (
              <li key={index}>{filename}</li>
            ))}
          </ul>
        </React.Fragment>
      ))}
    </div>
  );
};

export default FileListingSidebarContent;
