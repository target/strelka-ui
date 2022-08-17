import * as React from "react";
import { Route, Switch } from "react-router-dom";

import PrivateRoute from './PrivateRoute'
import LoginPage from "../pages/Login";
import AppLayout from "../layouts/AppLayout";

export const MainRouter = () => {

  return (
    <Switch>
      <Route path="/login" key="login">
        <LoginPage />
      </Route>
      <PrivateRoute key="/">
          <AppLayout />
      </PrivateRoute>
    </Switch>
  );
};

export default MainRouter;
