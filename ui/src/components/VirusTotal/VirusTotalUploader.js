import React, { useState } from "react";
import { Input, Button, message, Typography, Form } from "antd";
import { MessageOutlined, NumberOutlined } from "@ant-design/icons";
import { APP_CONFIG } from "../../config";
import { fetchWithTimeout } from "../../util";

const { Text } = Typography;

const VirusTotalUploader = ({ onUploadSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmitVtHash = () => {
    form
      .validateFields()
      .then((values) => {
        setLoading(true);
        const payload = {
          description: values.description,
          hash: values.hash,
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
            form.resetFields(); // Reset fields
            message.success(
              `${values.hash} analyzed successfully via VirusTotal!`
            );
            setLoading(false); // Stop loading
          })
          .catch((error) => {
            message.error(`Error submitting hash: ${error.message}`);
            setLoading(false); // Stop loading
          });
      })
      .catch((errorInfo) => {
        // Handle form validation error
        message.error(`Error submitting hash: Hash must be a valid MD5 (32), SHA1 (40), or SHA256 (64) characters long`);
      });
  };

  return (
    <Form form={form} layout="vertical">
      <Form.Item
        name="description"
        initialValue=""
        style={{ marginBottom: "12px" }}
      >
        <Input
          prefix={<MessageOutlined />}
          placeholder="(Optional) Description to be saved with submission..."
        />
      </Form.Item>
      <Form.Item
        name="hash"
        rules={[
          { required: true, message: "Please input a hash" },
          () => ({
            validator(_, value) {
              if (!value || [32, 40, 64].includes(value.length)) {
                return Promise.resolve();
              }
              return Promise.reject(
                new Error(
                  "Hash must be a valid MD5 (32), SHA1 (40), or SHA256 (64) characters long"
                )
              );
            },
          }),
        ]}
        style={{ marginBottom: "12px" }}
      >
        <Input
          prefix={<NumberOutlined />}
          placeholder="MD5, SHA1, SHA256 Hash..."
          disabled={loading}
          style={{ fontSize: "12px" }}
        />
      </Form.Item>
      <Form.Item style={{ float: "right", marginBottom: "0px" }}>
        <Button type="primary" onClick={handleSubmitVtHash} loading={loading}>
          <Text strong style={{ fontSize: "12px", color: "white" }}>
            Submit Hash
          </Text>
        </Button>
      </Form.Item>
    </Form>
  );
};

export default VirusTotalUploader;
