import { Layout, Menu } from "antd";
import { BarChartOutlined, UploadOutlined } from "@ant-design/icons";

import { Link } from "react-router-dom";
import { InternalRouter } from "../routes/InternalRouter";
import { useContext } from "react";
import AuthCtx from "../contexts/auth";
import { APP_CONFIG } from "../config";

const { Header } = Layout;
const { SubMenu } = Menu;

const AppLayout = () => {
  const { logout } = useContext(AuthCtx);

  const doLogout = () => {
    fetch(`${APP_CONFIG.BACKEND_URL}/auth/logout`, {
      method: "GET",
      mode: "cors",
      credentials: "include",
    }).finally(() => {
      logout();
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
              <Link to="/submissions?just_mine=true" key={window.location.pathname}>My Submissions</Link>
            </Menu.Item>
            <Menu.Item key="all-submissions">
              <Link to="/submissions" key={window.location.pathname}>All Submissions</Link>
            </Menu.Item>
          </SubMenu>

          <Menu.Item key="logout" style={{ float: "right" }} onClick={doLogout}>
            Logout
          </Menu.Item>
        </Menu>
      </Header>

      <InternalRouter />
    </Layout>
  );
};

export default AppLayout;
