import { memo, useState } from "react";
import { message } from "antd";

const Authentication = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    window.localStorage.getItem("isAuthenticated") || false
  );

  const handle401 = () => {
    message.info("Please log in, your session may have timed out.");
    window.localStorage.removeItem("isAuthenticated");
    setIsAuthenticated(false);
  };

  const logout = () => {
    window.localStorage.removeItem("isAuthenticated");
    setIsAuthenticated(false);
    message.success("You have successfully logged out");
  };

  const login = () => {
    window.localStorage.setItem("isAuthenticated", true);
    setIsAuthenticated(true);
  };

  return typeof children === "function" // check for render prop or just children pass-through
    ? children({
        setIsAuthenticated,
        isAuthenticated,
        handle401,
        login,
        logout,
      })
    : children;
};

export default memo(Authentication);
