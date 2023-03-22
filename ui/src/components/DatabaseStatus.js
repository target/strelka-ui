import React, { useState, useEffect } from "react";
import { Avatar, Tooltip } from "antd";
import { DatabaseOutlined } from "@ant-design/icons";
import { fetchWithTimeout } from "../util";
import { APP_CONFIG } from "../config";

function SystemStatus() {
  const [isDatabaseOnline, setIsDatabaseOnline] = useState(false);

  useEffect(() => {
    fetchWithTimeout(`${APP_CONFIG.BACKEND_URL}/strelka/status/database`, {
      method: "GET",
      timeout: 5000,
    })
      .then((response) => {
        if (response.status === 200) {
          setIsDatabaseOnline(true);
        } else {
          setIsDatabaseOnline(false);
          console.error(
            `Failed to fetch database status. Status code: ${response.status}`
          );
        }
      })
      .catch((error) => {
        setIsDatabaseOnline(false);
        console.error(
          `Failed to fetch database status. Error message: ${error.message}`
        );
      });
  }, []);

  const statusTooltip = isDatabaseOnline
    ? "Database is available."
    : "Cannot connect to database. File submission may not work. Contact your administrator for details.";

  return (
    <div>
      <Tooltip title={statusTooltip}>
        <Avatar
          style={{ backgroundColor: isDatabaseOnline ? "#52c41a" : "#eb2f96" }}
          icon={<DatabaseOutlined />}
        />
      </Tooltip>
    </div>
  );
}

export default SystemStatus;
