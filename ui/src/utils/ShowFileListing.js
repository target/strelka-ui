// ShowFileListing.jsx
import React, { useState } from "react";
import { Panel } from "reactflow";
import { Button, Drawer } from "antd";
import { UnorderedListOutlined } from "@ant-design/icons";
import FileListingSidebar from "./FileListingSidebar"; // Assuming you have this component

function ShowFileListing({ nodes }) {
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);

  const toggleDrawer = () => {
    setIsDrawerVisible(!isDrawerVisible);
  };

  return (
    <>
      <Panel position="top-right" style={{ marginTop: "55px" }}>
        <Button
          shape="round"
          icon={<UnorderedListOutlined />}
          onClick={toggleDrawer}
        >
          Show File Listing
        </Button>
      </Panel>
      <Drawer
        title="File Listing"
        placement="right"
        closable={true}
        onClose={toggleDrawer}
        open={isDrawerVisible}
        width={500}
      >
        <FileListingSidebar nodes={nodes} />
      </Drawer>
    </>
  );
}

export default ShowFileListing;
