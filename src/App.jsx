import React, { lazy, Suspense, useEffect } from "react";
import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";
import { FirestoreProvider, AuthProvider, useFirebaseApp } from "reactfire";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { themeChange } from "theme-change";
import { getAuth } from "firebase/auth";
const Layout = lazy(() => import("./containers/Layout"));
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
        <BrowserRouter>
              <Layout/>
          </BrowserRouter>
        </FirestoreProvider>
      </AuthProvider>
    </>
  );
}

export default App;
