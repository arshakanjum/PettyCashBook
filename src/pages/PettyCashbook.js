import React, { useState, useEffect } from "react";

import CashBook from "../components/Tabs/CashBook";
import Employees from "./Employees";

const Tabs = {
  CASHBOOK: "Cashbook",
  EMPLOYEES: "Employees",
};

function PettyCashbook() {
  const [activeTab, setActiveTab] = useState(Tabs.CASHBOOK);
  const activeClass = "tab tab-bordered tab-active";
  const normalClass = "tab tab-bordered";
  return (
    <>
      <div className="mx-auto mb-4 tabs">
        {Object.values(Tabs).map((val) => (
          <a
            className={activeTab === val ? activeClass : normalClass}
            onClick={() => setActiveTab(val)}
          >
            {val}
          </a>
        ))}
      </div>
      {activeTab === Tabs.CASHBOOK && <CashBook />}
      {activeTab === Tabs.EMPLOYEES && <Employees />}
    </>
  );
}

export default PettyCashbook;
