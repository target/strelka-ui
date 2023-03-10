import React, { useState, useEffect } from "react";
import { Tag, Tooltip } from "antd";
import { fetchWithTimeout } from "../util";
import { APP_CONFIG } from "../config";

function SystemStatus() {
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    fetchWithTimeout(`${APP_CONFIG.BACKEND_URL}/strelka/status`, {
      method: "GET",
      timeout: 5000,
    })
      .then((response) => {
        if (response.ok) {
          setIsOnline(true);
        } else {
          setIsOnline(false);
        }
      })
      .catch((error) => {
        setIsOnline(false);
      });
  }, []);

  return (
    <div>
      <Tooltip
        title={
          isOnline
            ? "File submission is available."
            : "File submission will likely not work. Contact your administrator."
        }
      >
        <Tag color={isOnline ? "green" : "red"}>
          {isOnline ? "Strelka: Online" : "Strelka: Offline"}
        </Tag>
      </Tooltip>
    </div>
  );
}

export default SystemStatus;
