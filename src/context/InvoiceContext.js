import React, { useState, useMemo } from "react";

// create context
export const InvoiceContext = React.createContext();

export const InvoiceProvider = ({ children }) => {
  const [invoiceState, setInvoiceState] = useState({
    Customer: { CustomerName: "", CustomerAddress: "" },
    Items: [],
    InvoiceNumber: "test",
  });
  const value = useMemo(
    () => ({
      invoiceState,
      setInvoiceState,
    }),
    [invoiceState]
  );

  return (
    <InvoiceContext.Provider value={value}>{children}</InvoiceContext.Provider>
  );
};
