import React, { useState, useMemo } from "react";

// create context
export const InvoiceContext = React.createContext();

export const InvoiceProvider = ({ children }) => {
  const [invoiceState, setInvoiceState] = useState({
    Customer: { Name: "", Address: "" },
    Items: [],
    Discount: 0,
    OtherCharges: 0,
    isEditable: true,
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
