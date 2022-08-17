import React, { useContext, useState } from "react";
import { Card, message } from "antd";
import ProForm, { ProFormText } from "@ant-design/pro-form";
import { KeyOutlined, UserOutlined } from "@ant-design/icons";
import { Redirect } from "react-router-dom";
import GenericLogo from "../components/GenericLogo";
import AuthCtx from "../contexts/auth";
import { APP_CONFIG } from "../config";
import { fetchWithTimeout } from "../util";

const LoginPage = () => {
  const { isAuthenticated, login } = useContext(AuthCtx);

  if (isAuthenticated) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: "-1",
        background: "#f0f2f5",
        backgroundImage: "url(/dots.svg)",
      }}
    >
      {!isAuthenticated && (
        <Card>
          <div
            style={{
              width: 330,
              margin: "auto",
            }}
          >
            <ProForm
              onFinish={async (values) => {
                var formBody = [];
                for (let property in values) {
                  let encodedKey = encodeURIComponent(property);
                  let encodedValue = encodeURIComponent(values[property]);
                  formBody.push(encodedKey + "=" + encodedValue);
                }
                formBody = formBody.join("&");

                try {
                  const res = await fetchWithTimeout(
                    `${APP_CONFIG.BACKEND_URL}/auth/login`,
                    {
                      method: "POST",
                      credentials: "include",
                      headers: {
                        "Content-Type":
                          "application/x-www-form-urlencoded;charset=UTF-8",
                      },
                      body: formBody,
                      timeout: APP_CONFIG.LOGIN_TIMEOUT,
                    }
                  );

                  if (res.status === 200) {
                    login();
                    message.success(`Login succeeded`);
                  } else {
                    console.error(res);
                    message.error("Login failed");
                  }
                } catch (e) {
                  console.error(e);
                  if (e.name === "AbortError") {
                    message.error("Login timed out");
                  } else {
                    message.error("Login failed");
                  }
                }
              }}
              submitter={{
                searchConfig: {
                  submitText: "Login",
                },
                render: (_, dom) => dom.pop(),
                submitButtonProps: {
                  type: "primary",
                  size: "large",
                  style: {
                    width: "100%",
                  },
                },
              }}
            >
              <GenericLogo />
              <h1
                style={{
                  textAlign: "center",
                }}
              >
                {" "}
                Strelka Fileshot UI
              </h1>
              <ProFormText
                fieldProps={{
                  size: "large",
                  prefix: <UserOutlined />,
                }}
                name="username"
                placeholder="Username"
                rules={[
                  {
                    required: true,
                    message: "Please enter your username",
                  },
                ]}
              />

              <ProFormText.Password
                fieldProps={{
                  size: "large",
                  prefix: <KeyOutlined />,
                }}
                name="password"
                placeholder="Password"
                rules={[
                  {
                    required: true,
                    message: "Please enter your password",
                  },
                ]}
              />
            </ProForm>
          </div>
        </Card>
      )}
    </div>
  );
};

export default LoginPage;
