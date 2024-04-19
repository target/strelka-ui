import React, { useState } from "react";
import { Collapse, Tag } from "antd";
import FileHighlightsOverviewCard from "./HighlightsOverviewCard";
import { antdColors } from "../../../utils/colors";

const FileHighlightsOverviewLanding = ({ data, onFileNameSelect }) => {
  const [filterApplied, setFilterApplied] = useState(false);

  const handleFileNameSelect = (selectedFileName) => {
    setFilterApplied(!!selectedFileName);
    onFileNameSelect(selectedFileName);
  };

  const borderStyle = filterApplied
    ? {
        // Styles when the filter is applied
        border: `2px solid ${antdColors.blue}50`,
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        padding: "3px",
        transition: "all 0.3s", // Transition for both applying and removing the filter
      }
    : {
        // Styles when the filter is not applied (could potentially add styles for the normal state if needed)
        transition: "all 0.3s",
      };

  return (
    <Collapse
      defaultActiveKey={["1"]}
      style={{
        width: "100%",
        marginBottom: "10px",
        ...borderStyle,
      }}
    >
      <Collapse.Panel
        header={
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            File Highlights
            {filterApplied && (
              <Tag color="blue">
                Filter Applied
              </Tag>
            )}{" "}
          </div>
        }
        key="1"
      >
        <FileHighlightsOverviewCard
          data={data}
          onFileNameSelect={handleFileNameSelect}
        />
      </Collapse.Panel>
    </Collapse>
  );
};

export default FileHighlightsOverviewLanding;
