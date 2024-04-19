import React, { useState, useEffect } from "react";
import { Collapse, Typography } from "antd";
import FileHeaderFooterCard from "./HeaderFooterCard";

const { Text } = Typography;

const FileHeaderFooterLanding = ({ selectedNodeData, expandAll }) => {
  const header = selectedNodeData?.scan?.header;
  const footer = selectedNodeData?.scan?.footer;
  const [activeKey, setActiveKey] = useState([]);

  useEffect(() => {
    setActiveKey(expandAll ? ["1"] : []);
  }, [expandAll]);

  if (!header || !footer) {
    return null;
  }

  return (
    <Collapse
      activeKey={activeKey}
      onChange={(keys) => setActiveKey(keys)}
      style={{ width: "100%", marginBottom: "10px" }}
    >
      <Collapse.Panel
        header={
          <div>
            <Text strong>Header / Footer</Text>
            <div style={{ fontSize: "smaller", color: "#888" }}>
              Header: {header.header}
            </div>
            <div style={{ fontSize: "smaller", color: "#888" }}>
              Footer: {footer.footer}
            </div>
          </div>
        }
        key="1"
      >
        <FileHeaderFooterCard data={selectedNodeData} />
      </Collapse.Panel>
    </Collapse>
  );
};

export default FileHeaderFooterLanding;
