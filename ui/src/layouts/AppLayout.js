import { useState } from "react";
import { Layout, Menu, message, Modal, Tag, Typography } from "antd";
import { BarChartOutlined, KeyOutlined, CopyOutlined } from "@ant-design/icons";

import { Link } from "react-router-dom";
import { InternalRouter } from "../routes/InternalRouter";
import { useContext } from "react";
import AuthCtx from "../contexts/auth";
import { APP_CONFIG } from "../config";
import SystemStatus from "../components/SystemStatus";
import DatabaseStatus from "../components/DatabaseStatus";

const { Paragraph, Text } = Typography;

const AppLayout = () => {
  const { logout } = useContext(AuthCtx);
  const [apiKey, setApiKey] = useState("");
  const [isKeyModalVisible, setIsKeyModalVisible] = useState(false);

  const showKeyModal = () => {
    setIsKeyModalVisible(true);
  };

  const handleKeyModalCancel = () => {
    setIsKeyModalVisible(false);
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      message.success("API key copied to clipboard!");
    } catch (err) {
      console.error(err);
      message.error("Failed to copy API key to clipboard.");
    }
  };

  const doLogout = () => {
    fetch(`${APP_CONFIG.BACKEND_URL}/auth/logout`, {
      method: "GET",
      mode: "cors",
      credentials: "include",
    }).finally(() => {
      logout();
    });
  };

  const getApiKey = () => {
    fetch(`${APP_CONFIG.BACKEND_URL}/auth/apikey`, {
      method: "GET",
      mode: "cors",
      credentials: "include",
    }).then((response) => {
      if (response.ok) {
        response.json().then((data) => {
          const apiKey = data.api_key;
          setApiKey(apiKey);
          showKeyModal();
        });
      } else {
        message.error("Failed to retrieve API key.");
      }
    });
  };

  const menuItems = [
    {
      key: 'home',
      label: (

          <img
            style={{ marginTop: '7px', paddingRight: '25px' }}
            src="/logo192.png"
            alt="Logo"
            height="30px"
          />

      ),
    },
    {
      key: 'dashboard',
      icon: <BarChartOutlined />,
      label: <Link to="/">Dashboard</Link>,
    },
    {
      key: 'key',
      icon: <KeyOutlined />,
      label: <Link to="/" onClick={getApiKey}>Get API Key</Link>,
    },
    {
      key: 'logout',
      label: <span onClick={doLogout}>Logout</span>,
    },
    {
      key: 'system-status',
      label: <SystemStatus />,
      disabled: true,
      style: { marginLeft: 'auto', background: 'none', cursor: 'pointer' },
    },
    {
      key: 'database-status',
      label: <DatabaseStatus />,
      disabled: true,
      style: { background: 'none', cursor: 'pointer' },
    },
  ];

  return (
    <Layout>
      <Menu
        theme="light"
        style={{
          boxShadow:
            "0px 4px 6px -1px rgba(0, 0, 0, 0.1),0px 2px 4px -1px rgba(0, 0, 0, 0.06)",
          paddingLeft: "50px",
          paddingRight: "50px",
        }}
        mode="horizontal"
        defaultSelectedKeys={["2"]}
        items={menuItems}

      >

      </Menu>

      <Modal
        title="API Key"
        open={isKeyModalVisible}
        onCancel={handleKeyModalCancel}
        footer={null}
      >
        <center>
          <Tag
            style={{ cursor: "pointer", fontSize: "16px" }}
            icon={<CopyOutlined />}
            color="success"
            onClick={() => copyToClipboard(apiKey)}
          >
            {apiKey}
          </Tag>
        </center>
        <br />
        <Paragraph>
          Examples of using your API key with Python requests:
        </Paragraph>
        <Text>
          <pre style={{ fontSize: "10px" }}>
            {`import requests

# Set API key and base URL
api_key = "KEY"
url_base = "http://<STRELKA_UI_ADDRESS>:<STRELKA_UI_PORT/api/strelka"

# Define headers
headers = {"X-API-KEY": api_key,
           "Content-Type": "application/json",
           "Accept": "application/json"
           }

# GET: Get list of scans from the Strelka UI API
url_route = "/scans?page=1&per_page=10"
response = requests.get(url_base + url_route, headers=headers)

# Check response status code
if response.status_code == 200:
    # Print response data
    print(response.text)
else:
    # Print error message
    print(f"Error: {response.status_code} - {response.text}")


# POST: Upload File to Strelka UI API
url_route = "/upload"
filename = "test_file.txt"
description = "This is a test file"

headers = {"X-API-KEY": api_key,
           }

with open(filename, "rb") as f:
    file_data = f.read()

files = [("file", (filename, file_data))]
data = {"description": description}

response = requests.post(url_base + url_route, files=files, data=data, headers=headers)

# Check response status code
if response.status_code == 200:
    # Print response data
    print(response.text)
else:
    # Print error message
    print(f"Error: {response.status_code} - {response.text}")`}{" "}
          </pre>
        </Text>
      </Modal>
      <div className="main-content">
        <InternalRouter />
      </div>
    </Layout>
  );
};

export default AppLayout;
