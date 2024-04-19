import React, { useState } from "react";
import { Tag, Tooltip, Typography, Space } from "antd";
import { getIconConfig } from "../../../utils/iconMappingTable";
import { antdColors } from "../../../utils/colors";

const { Text } = Typography;

const FileTypeOverviewCard = ({ data, onFileTypeSelect }) => {
  const [selectedFileType, setSelectedFileType] = useState(null);
  const [showMoreFileTypes, setShowMoreFileTypes] = useState(false);
  const MAX_ITEMS_VISIBLE = 10;
  

  // Handler for selecting or deselecting a file type
  const selectFileType = (mimeType) => {
    const newSelectedFileType = mimeType === selectedFileType ? null : mimeType;
    setSelectedFileType(newSelectedFileType);
    onFileTypeSelect(newSelectedFileType); // Pass null if deselected to remove filter
  };

  // Create an object to hold the count and associated filenames of mime types
  const mimeTypeDetails = {};

  // Iterate over the strelka_response to populate mimeTypeDetails
  data.strelka_response.forEach((response) => {
    const mimeType = (response.file?.flavors?.yara && response.file.flavors?.yara[0]) || response.file.flavors.mime[0];
    if (mimeTypeDetails[mimeType]) {
      mimeTypeDetails[mimeType].count++;
      mimeTypeDetails[mimeType].files.push(response.file.name || response.file.scan?.hash.md5); // Add filename to array
    } else {
      mimeTypeDetails[mimeType] = { count: 1, files: [response.file.name || response.scan?.hash.md5] }; // Initialize with first filename
    }
  });

  // Convert the object to an array and sort descending by count
  const mimeTypeData = Object.entries(mimeTypeDetails)
    .map(([mimeType, details]) => ({
      mimeType,
      count: details.count,
      files: details.files,
    }))
    .sort((a, b) => b.count - a.count);

  const renderFileTypeTag = (item) => {
    const iconConfig = getIconConfig("strelka", item.mimeType.toLowerCase());
    const IconComponent = iconConfig?.icon;
    const bgColor = iconConfig?.color || antdColors.darkGray;

    return (
      <Space
        key={item.mimeType}
        direction="vertical"
        size="small"
        style={{ width: "100%", marginBottom: "8px" }}
      >
        <Tooltip placement="topLeft" title={item.files.join(", ")}>
          <Tag
            onClick={() => selectFileType(item.mimeType)}
            style={{
              width: "100%",
              justifyContent: "space-between",
              alignItems: "center",
              background: selectedFileType === item.mimeType
              ? `${antdColors.blue}20`
              : "none",
              cursor: "pointer",
              border:
                selectedFileType === item.mimeType
                  ? `1px solid ${antdColors.blue}`
                  : "none",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <div
                className="file-type-box"
                style={{ backgroundColor: bgColor, marginRight: "8px" }}
              >
                {IconComponent && (
                  <IconComponent style={{ fontSize: "12px" }} />
                )}
              </div>
              <Text
                style={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  fontSize: "12px",
                }}
              >
                {item.mimeType}
              </Text>
              <Text style={{ fontSize: "12px", marginLeft: "auto" }}>
                {item.count}
              </Text>
            </div>
          </Tag>
        </Tooltip>
      </Space>
    );
  };

  const renderedFileTypes = mimeTypeData
    .slice(0, showMoreFileTypes ? mimeTypeData.length : MAX_ITEMS_VISIBLE)
    .map(renderFileTypeTag);

  return (
    <div>
      {renderedFileTypes}
      {!showMoreFileTypes && mimeTypeData.length > MAX_ITEMS_VISIBLE && (
        <Space direction="vertical" style={{ width: "100%" }}>
          <Text
            onClick={() => setShowMoreFileTypes(true)}
            style={{
              marginLeft: "30px",
              fontSize: "12px",
              color: antdColors.blue,
              cursor: "pointer",
            }}
          >
            ... and {mimeTypeData.length - MAX_ITEMS_VISIBLE} more
          </Text>
        </Space>
      )}
    </div>
  );
};

export default FileTypeOverviewCard;
