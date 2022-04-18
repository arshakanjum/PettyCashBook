import React, { Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./assets/css/tailwind.output.css";
import "./index.css";
import App from "./App.jsx";
import { SidebarProvider } from "./context/SidebarContext";
import ThemedSuspense from "./components/ThemedSuspense";

import { FirebaseAppProvider } from "reactfire";
import firebaseConfig from "./firebase.js";

// if (process.env.NODE_ENV !== 'production') {
//   const axe = require('react-axe')
//   axe(React, ReactDOM, 1000)
// }

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <SidebarProvider>
    <Suspense fallback={<ThemedSuspense />}>
        <FirebaseAppProvider firebaseConfig={firebaseConfig}>
          <React.StrictMode>
            <App />
          </React.StrictMode>
        </FirebaseAppProvider>
    </Suspense>
  </SidebarProvider>
);
