import React, { lazy, useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import AccessibleNavigationAnnouncer from "./components/AccessibleNavigationAnnouncer";
import { FirestoreProvider, AuthProvider, useFirebaseApp } from "reactfire";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
const Layout = lazy(() => import("./containers/Layout"));
const Login = lazy(() => import("./pages/Login"));
const CreateAccount = lazy(() => import("./pages/CreateAccount"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
function App() {
  useEffect(() => {
    window.process = { ...window.process };
  }, []);
  const app = useFirebaseApp();
  const firestoreInstance = getFirestore(app);
  const auth = getAuth(app);
  return (
    <>
      <AuthProvider sdk={auth}>
        <FirestoreProvider sdk={firestoreInstance}>
          <Router basename="/PettyCashBook">
            <AccessibleNavigationAnnouncer />
            <Switch>
              <Route path="/login" component={Login} />
              <Route path="/create-account" component={CreateAccount} />
              <Route path="/forgot-password" component={ForgotPassword} />

              {/* Place new routes over this */}
              <Route path="/app" component={Layout} />
              {/* If you have an index page, you can remothis Redirect */}
              <Redirect exact from="/" to="/app" />
              {/* <Redirect exact from="/" to="/app" /> */}
            </Switch>
          </Router>
        </FirestoreProvider>
      </AuthProvider>
    </>
  );
}

export default App;
