import { ActiveAMCList } from "../components/ActiveAMCList";

import React from "react";
import AddAMCCard from "../components/AddAMCCard";
import { InvoiceProvider } from "../context/InvoiceContext";

export default function AMC() {
  return (
    <InvoiceProvider>
      <div className="w-full h-full gap-4 p-4 bg-white card rounded-2xl">
        <AddAMCCard />
        <ActiveAMCList />
      </div>
    </InvoiceProvider>
  );
}
