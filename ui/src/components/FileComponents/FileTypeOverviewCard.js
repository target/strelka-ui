import React from "react";
import { Tag, Tooltip, Typography, Space } from "antd";
import { getIconConfig } from "../../utils/iconMappingTable";

const { Text } = Typography;

const FileTypeOverviewCard = ({ data }) => {
  // Create an object to hold the count and associated filenames of mime types
  const mimeTypeDetails = {};

  // Iterate over the strelka_response to populate mimeTypeDetails
  data.strelka_response.forEach((response) => {
    const mimeType = response.file.flavors.mime[0];
    if (mimeTypeDetails[mimeType]) {
      mimeTypeDetails[mimeType].count++;
      mimeTypeDetails[mimeType].files.push(response.file.name); // Add filename to array
    } else {
      mimeTypeDetails[mimeType] = { count: 1, files: [response.file.name] }; // Initialize with first filename
    }
  });

  // Convert the object to an array and sort descending by count
  const mimeTypeData = Object.entries(mimeTypeDetails)
    .map(([mimeType, details]) => ({
      mimeType,
      count: details.count,
      files: details.files
    }))
    .sort((a, b) => b.count - a.count); // Sort descending by count

  return (
    <div>
      {mimeTypeData.map((item) => {
        const iconConfig = getIconConfig("strelka", item.mimeType.toLowerCase());
        const IconComponent = iconConfig?.icon;
        const bgColor = iconConfig?.color || "defaultBackgroundColor";

        return (
          <Space key={item.mimeType} direction="vertical" size="small" style={{ width: "100%", marginBottom: "8px" }}>
            <Tooltip placement="topLeft" title={item.files.join(', ')}>
              <Tag
                style={{
                  width: "100%",
                  justifyContent: "space-between",
                  alignItems: "center",
                  border: "none",
                  background: "none",
                }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div className="file-type-box" style={{ backgroundColor: bgColor, marginRight: "8px" }}>
                    {IconComponent && <IconComponent style={{ fontSize: "12px" }} />}
                  </div>
                  <Text style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: "12px" }}>
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
      })}
    </div>
  );
};

export default FileTypeOverviewCard;
