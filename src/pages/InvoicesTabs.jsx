import React, { useState, useEffect } from "react";
import Customers from "../components/Tabs/Customers";
import Invoice from "../components/Tabs/Invoice";
import Products from "../components/Tabs/Products";
import Billing from "./Billing";

const Tabs = {
  BILLING: "Billing",
};

function InvoicesTabs() {
  const [activeTab, setActiveTab] = useState(Tabs.BILLING);
  const activeClass = "tab tab-bordered tab-active";
  const normalClass = "tab tab-bordered";
  return (
    <div className="h-full bg-white card rounded-2xl">
      {/* <div className="flex mx-auto mb-4 tabs">
        {Object.values(Tabs).map((val) => (
          <a
            className={activeTab === val ? activeClass : normalClass}
            onClick={() => setActiveTab(val)}
          >
            {val}
          </a>
        ))}
      </div> */}
      <div className="items-center justify-center block w-full p-8 overflow-auto ">
        {activeTab === Tabs.BILLING && <Billing />}
      </div>
    </div>
  );
}

export default InvoicesTabs;
