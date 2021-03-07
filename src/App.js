import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import * as ROUTES from "./constants/routes";
import useAuthListener from "./hooks/use-auth-listener";
import UserContext from "./context/user";

import ProtectedRoute from "./helpers/protected-route";

const Dashboard = lazy(() => import("./pages/dashboard"));
const Login = lazy(() => import("./pages/login"));
const Signup = lazy(() => import("./pages/signup"));
const Profile = lazy(() => import("./pages/profile"));
const NotFound = lazy(() => import("./pages/not-found"));

function App() {
    const { user } = useAuthListener();
    return (
        <UserContext.Provider value={{ user }}>
            <Router>
                <Suspense fallback={<p>Loading...</p>}>
                    <Switch>
                        <Route
                            path={ROUTES.LOGIN}
                            component={Login}
                            // exact
                        ></Route>
                        <Route
                            path={ROUTES.SIGN_UP}
                            component={Signup}
                            // exact
                        ></Route>
                        <Route
                            path={ROUTES.PROFILE}
                            component={Profile}
                            // exact
                        ></Route>
                        <ProtectedRoute
                            user={user}
                            path={ROUTES.DASHBOARD}
                            exact
                        >
                            <Dashboard />
                        </ProtectedRoute>
                        <Route component={NotFound}></Route>
                    </Switch>
                </Suspense>
            </Router>
        </UserContext.Provider>
    );
}

export default App;
