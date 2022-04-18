import React, { useContext, Suspense, useEffect, lazy } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import routes from "../routes";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Main from "../containers/Main";
import ThemedSuspense from "../components/ThemedSuspense";
import { SidebarContext } from "../context/SidebarContext";
import Billing from "../pages/Billing";
import Employees from "../pages/Employees";
import AMC from "../pages/AMC";
import PettyCashTabs from "../pages/PettyCashTabs";
import Customers from "../pages/Customers";

function Layout() {
  const { isSidebarOpen, closeSidebar } = useContext(SidebarContext);
  let location = useLocation();

  useEffect(() => {
    closeSidebar();
  }, [location]);

  return (
    <div>
      <Sidebar />

      <div className="flex h-full ">
        <Header />
        <Main>
          <Suspense fallback={<ThemedSuspense />}>
            <Routes>
              <Route path="/invoices" element={<Billing/>}></Route>
              <Route path="/pettycashbook" element={<PettyCashTabs/>}></Route>
              <Route path="/customers" element={<Customers/>}></Route>
              <Route path="/AMC" element={<AMC/>}></Route>
            </Routes>
          </Suspense>
        </Main>
      </div>
    </div>
  );
}

export default Layout;
