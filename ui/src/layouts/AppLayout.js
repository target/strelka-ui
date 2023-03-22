import { useState } from "react";
import { Layout, Menu, message, Modal, Tag, Typography } from "antd";
import {
  BarChartOutlined,
  UploadOutlined,
  KeyOutlined,
  CopyOutlined,
} from "@ant-design/icons";
import { CopyToClipboard } from "react-copy-to-clipboard";

import { Link } from "react-router-dom";
import { InternalRouter } from "../routes/InternalRouter";
import { useContext } from "react";
import AuthCtx from "../contexts/auth";
import { APP_CONFIG } from "../config";
import SystemStatus from "../components/SystemStatus";
import DatabaseStatus from "../components/DatabaseStatus";

const { Paragraph, Text } = Typography;
const { Header } = Layout;
const { SubMenu } = Menu;

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

  return (
    <Layout className="layout">
      <Header>
        <div className="logo" />
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["2"]}>
          <Menu.Item key="dashboard" icon={<BarChartOutlined />}>
            <Link to="/">Dashboard</Link>
          </Menu.Item>
          <SubMenu
            key="submissions"
            icon={<UploadOutlined />}
            title="Submissions"
          >
            <Menu.Item key="my-submissions">
              <Link
                to="/submissions?just_mine=true"
                key={window.location.pathname}
              >
                My Submissions
              </Link>
            </Menu.Item>
            <Menu.Item key="all-submissions">
              <Link to="/submissions" key={window.location.pathname}>
                All Submissions
              </Link>
            </Menu.Item>
          </SubMenu>
          <Menu.Item key="key" icon={<KeyOutlined />} onClick={getApiKey}>
            <Link to="/">Get API Key</Link>
          </Menu.Item>
          <Menu.Item key="logout" onClick={doLogout}>
            Logout
          </Menu.Item>

          <Menu.Item disabled key="status" style={{ marginLeft: "auto", background: "none", cursor: "pointer" }}>
            <SystemStatus></SystemStatus>
          </Menu.Item>
          <Menu.Item disabled key="status" style={{ background: "none", cursor: "pointer" }}>
            <DatabaseStatus></DatabaseStatus>
          </Menu.Item>
        </Menu>
      </Header>

      <Modal
        title="API Key"
        visible={isKeyModalVisible}
        onCancel={handleKeyModalCancel}
        footer={null}
      >
        <center>
          <CopyToClipboard
            text={apiKey}
            onCopy={() => message.success("API key copied to clipboard!")}
          >
            <Tag
              style={{ cursor: "pointer", fontSize: "16px" }}
              icon={<CopyOutlined />}
              color="success"
            >
              {apiKey}
            </Tag>
          </CopyToClipboard>
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

      <InternalRouter />
    </Layout>
  );
};

export default AppLayout;
