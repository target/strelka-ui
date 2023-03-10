import React from "react";
import { Route, Redirect } from "react-router-dom";

import AuthCtx from "../contexts/auth";

const PrivateRoute = ({ children, ...rest }) => {
  const { isAuthenticated } = React.useContext(AuthCtx);

  return (
    <Route
      {...rest}
      render={({ location }) =>
        isAuthenticated ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location },
            }}
          />
        )
      }
    />
  );
};

export default PrivateRoute;
