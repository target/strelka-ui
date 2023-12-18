import * as React from "react";
import { Route, Switch } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";

import SubmissionViewPage from "../pages/SubmissionView";
import DashboardPage from "../pages/Dashboard";

export const InternalRouter = () => {
  return (
    <Switch>
      <PrivateRoute path="/submissions/:id" key="/submission-view">
        <SubmissionViewPage />
      </PrivateRoute>
      <Route key="/">
        <DashboardPage />
      </Route>
    </Switch>
  );
};

export default InternalRouter;
