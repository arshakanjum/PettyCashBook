import React from "react";
import Customers from "../components/Tabs/Customers";
import Invoice from "../components/Tabs/Invoice";
import InvoiceSteps from "../components/Tabs/InvoiceSteps";
import Products from "../components/Tabs/Products";
import { InvoiceProvider } from "../context/InvoiceContext";

export default function Billing() {
  return (
    <InvoiceProvider>
      <div className="flex flex-col h-fit lg:flex-row ">
        <div className="flex w-1/2 h-full scale-90 ">
          <Invoice />
        </div>
        <div className="divider lg:divider-horizontal"></div>
        <div className="flex w-1/2 h-fit card rounded-box place-items-center">
          <InvoiceSteps />
        </div>
      </div>
    </InvoiceProvider>
  );
}
