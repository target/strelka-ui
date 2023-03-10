import React, { useState } from "react";
import { Button, Typography } from "antd";
import { DataDisplayObj } from "../components/DataDisplay";

const { Title, Text } = Typography;

// Use state to control whether the data display is expanded or collapsed
const ScanDisplayCard = ({ scanner_name, data }) => {
  const [expanded, setExpanded] = useState(false);

  // Extract the item key from the scanner name
  const item_key = scanner_name
    .match(/Scan(.+)/)
    .map((v) => v.toLowerCase())[1];

  return (
    <div style={{ width: "100%" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <div>
          <Typography>
            <Title level={5}>{scanner_name}</Title>
            {data["scan"][`${item_key}`] ? (
              <Text>Took {data["scan"][`${item_key}`]["elapsed"]} seconds</Text>
            ) : (
              <Text>Scanner not supported in Scan Results view.</Text>
            )}
          </Typography>
        </div>
        <div>
          <Button onClick={() => setExpanded(!expanded)}>
            {expanded ? "Hide" : "Show"}
          </Button>
        </div>
      </div>
      <div
        style={{
          height: expanded ? "auto" : "0px",
          overflowX: "auto",
          width: "100%",
        }}
      >
        <br />
        <DataDisplayObj value={data["scan"][item_key]} />
      </div>
      <br />
    </div>
  );
};

export default ScanDisplayCard;
