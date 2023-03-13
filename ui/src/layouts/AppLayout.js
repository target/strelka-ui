import { useState } from "react";
import { Avatar, Layout, Menu, message } from "antd";
import { BarChartOutlined, UploadOutlined, KeyOutlined } from "@ant-design/icons";
import { CopyToClipboard } from "react-copy-to-clipboard";

import { Link } from "react-router-dom";
import { InternalRouter } from "../routes/InternalRouter";
import { useContext } from "react";
import AuthCtx from "../contexts/auth";
import { APP_CONFIG } from "../config";
import SystemStatus from "../components/SystemStatus";

const { Header } = Layout;
const { SubMenu } = Menu;

const AppLayout = () => {
  const { logout } = useContext(AuthCtx);
    const [apiKey, setApiKey] = useState("");

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
           <Menu.Item key={apiKey} onClick={getApiKey}>
              <CopyToClipboard text={apiKey}>
                <Avatar style={{ background: "none" }} icon={<KeyOutlined />} />
                </CopyToClipboard>
            </Menu.Item>
          <Menu.Item key="logout" onClick={doLogout}>
            Logout
          </Menu.Item>


          <Menu.Item disabled key="status" style={{ marginLeft: "auto" }}>
            <SystemStatus></SystemStatus>
          </Menu.Item>
        </Menu>
      </Header>

      <InternalRouter />
    </Layout>
  );
};

export default AppLayout;
