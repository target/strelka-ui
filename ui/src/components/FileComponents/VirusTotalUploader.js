import React, { useState } from "react";
import { Input, Button, message, Typography, Tooltip, Checkbox } from "antd";
import { MessageOutlined } from "@ant-design/icons";
import { APP_CONFIG } from "../../config";
import { fetchWithTimeout } from "../../util";

const { Text } = Typography;

const VirusTotalUploader = ({ onUploadSuccess }) => {
  const [fileDescription, setFileDescription] = useState(
    "No Description Provided"
  ); // State for file description to be submitted
  const [downloadEncrypted, setDownloadEncrypted] = useState(true); // State for encrypted checkbox
  const [vtHash, setVtHash] = useState(""); // State for hash to be submitted
  const [loading, setLoading] = useState(false); // State to manage button loading

  const handleVtHashChange = (e) => setVtHash(e.target.value);
  const handleDescriptionChange = (e) => setFileDescription(e.target.value);
  const handleDownloadEncryptedChange = (e) =>
    setDownloadEncrypted(e.target.checked);

  const handleSubmitVtHash = () => {
    setLoading(true); // Start loading when submission starts
    const payload = {
      description: fileDescription,
      hash: vtHash,
      encrypted: downloadEncrypted,
    };

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
            throw new Error(
              errorData.details || "Error occurred while submitting hash"
            );
          });
        }
        return response.json();
      })
      .then((data) => {
        onUploadSuccess(); // Trigger table refresh
        setVtHash(""); // Reset hash input
        message.success(`${vtHash} analyzed successfully via VirusTotal!`);
        setLoading(false); // Stop loading
      })
      .catch((error) => {
        message.error(`Error submitting hash: ${error.message}`);
        setLoading(false); // Stop loading
      });
  };

  return (
    <div>
      <div style={{ paddingBottom: 12 }}>
        <Input
          onChange={handleDescriptionChange}
          placeholder="Description to be saved with submission..."
          prefix={<MessageOutlined />}
        />
      </div>
      <div style={{ paddingBottom: 12 }}>
        <Input
          onChange={handleVtHashChange}
          placeholder="MD5, SHA1, SHA256 Hash..."
          value={vtHash}
          disabled={loading} // Disable input during loading
        />
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Tooltip title="If checked, sample will be submitted to Strelka in an encrypted zip file from VirusTotal with the password 'Infected'">
          <Checkbox
            checked={downloadEncrypted}
            onChange={handleDownloadEncryptedChange}
          >
            Submit Password Protected
          </Checkbox>
        </Tooltip>

        <Button
          type="primary"
          onClick={handleSubmitVtHash}
          loading={loading} // Use loading prop for loading indicator
        >
          <Text strong style={{ fontSize: "12px", color: "white" }}>
            Submit Hash
          </Text>
        </Button>
      </div>
    </div>
  );
};

export default VirusTotalUploader;
