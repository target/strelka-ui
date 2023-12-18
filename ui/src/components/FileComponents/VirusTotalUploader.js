import React, { useState } from "react";
import { Input, Button, message, Typography } from "antd";
import { MessageOutlined } from "@ant-design/icons";
import { APP_CONFIG } from "../../config";
import { fetchWithTimeout } from "../../util";

const { Text } = Typography;

const VirusTotalUploader = ({ onUploadSuccess }) => {
  const [fileDescription, setFileDescription] = useState("No Description Provided");
  const [vtHash, setVtHash] = useState("");
  const [loading, setLoading] = useState(false); // State to manage button loading

  const handleVtHashChange = (e) => setVtHash(e.target.value);
  const handleDescriptionChange = (e) => setFileDescription(e.target.value);

  const handleSubmitVtHash = () => {
    setLoading(true); // Start loading when submission starts
    const payload = { description: fileDescription, hash: vtHash };

    fetchWithTimeout(`${APP_CONFIG.BACKEND_URL}/strelka/upload`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      mode: "cors",
      credentials: "include",
      timeout: APP_CONFIG.API_TIMEOUT,
    })
    .then((response) => {
      if (!response.ok) {
        return response.json().then((errorData) => {
          throw new Error(errorData.details || 'Error occurred while submitting hash');
        });
      }
      return response.json();
    })
    .then((data) => {
      message.success("Hash submitted successfully");
      onUploadSuccess(); // Trigger table refresh
      setVtHash(""); // Reset hash input
    })
    .catch((error) => {
      message.error(`Error submitting hash: ${error.message}`);
      setLoading(false); // Stop loading
    });
  };

  return (
    <div>
      <Input
        onChange={handleDescriptionChange}
        placeholder="Description to be saved with submission..."
        prefix={<MessageOutlined />}
      />
      <br />
      <br />
      <div style={{ display: "flex" }}>
        <Input
          onChange={handleVtHashChange}
          placeholder="SHA256 Hash..."
          value={vtHash}
          style={{ marginRight: "15px" }}
          disabled={loading} // Disable input during loading
        />
        <Button
          type="primary"
          onClick={handleSubmitVtHash}
          loading={loading} // Use loading prop for loading indicator
        >
          <Text strong style={{ fontSize: "12px", color: "white" }}>Submit Hash</Text>
        </Button>
      </div>
    </div>
  );
};

export default VirusTotalUploader;
