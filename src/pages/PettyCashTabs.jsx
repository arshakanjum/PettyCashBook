import React, { useState, useEffect } from "react";
import CashBook from "../components/Tabs/CashBook";
import Employees from "./Employees";

const Tabs = {
  CASHBOOK: "CashBook",
  EMPLOYEES: "Employees",
};

function PettyCashTabs() {
  const [activeTab, setActiveTab] = useState(Tabs.CASHBOOK);
  const activeClass = "tab tab-bordered tab-active";
  const normalClass = "tab tab-bordered";
  return (
    <div className="h-full bg-white card rounded-2xl">
      <div className="flex mx-auto mb-4 tabs">
        {Object.values(Tabs).map((val) => (
          <a
            className={activeTab === val ? activeClass : normalClass}
            onClick={() => setActiveTab(val)}
          >
            {val}
          </a>
        ))}
      </div>
      <div className="items-center justify-center block w-full p-8 -mb-28">
        {activeTab === Tabs.CASHBOOK && <CashBook />}
        {activeTab === Tabs.EMPLOYEES && <Employees />}
      </div>
    </div>
  );
}

export default PettyCashTabs;
