import React, { lazy, useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  withRouter,
  Redirect,
} from "react-router-dom";
import AccessibleNavigationAnnouncer from "./components/AccessibleNavigationAnnouncer";
import { FirestoreProvider, AuthProvider, useFirebaseApp } from "reactfire";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { themeChange } from "theme-change";
import { getAuth } from "firebase/auth";
const Layout = lazy(() => import("./containers/Layout"));
const Login = lazy(() => import("./pages/Login"));
const CreateAccount = lazy(() => import("./pages/CreateAccount"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
function App() {
  const app = useFirebaseApp();
  const firestoreInstance = getFirestore(app);
  const auth = getAuth(app);
  useEffect(() => {
    themeChange(false);
    // 👆 false parameter is required for react project
  }, []);
  // if (process.env.NODE_ENV !== "production") {
  //   // Set up emulators
  //   connectFirestoreEmulator(firestoreInstance, "localhost", 8080);
  // }
  return (
    <>
      <AuthProvider sdk={auth}>
        <FirestoreProvider sdk={firestoreInstance}>
          <Router basename="/">
            <AccessibleNavigationAnnouncer />
            <Switch>
              <Route path="/login" component={Login} />
              <Route path="/create-account" component={CreateAccount} />
              <Route path="/forgot-password" component={ForgotPassword} />
              {/* Place new routes over this */}
              <Route path="/app" component={withRouter(Layout)} />
              {/* If you have an index page, you can remothis Redirect */}
              {/* <Redirect exact from="/" to="/" /> */}
              <Redirect exact from="/" to="/app" />
            </Switch>
          </Router>
        </FirestoreProvider>
      </AuthProvider>
    </>
  );
}

export default App;
