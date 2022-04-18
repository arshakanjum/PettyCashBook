import React, { useContext, useEffect, useRef, useState } from "react";
import Invoice from "../components/Tabs/Invoice";
import InvoiceSteps from "../components/Tabs/InvoiceSteps";
import { InvoiceContext, InvoiceProvider } from "../context/InvoiceContext";
import DataTable from "../components/Elements/DataTable";

const applyScaling = (scaledWrapper, scaledContent) => {
  scaledContent.style.transform = "scale(1, 1)";

  let { width: cw, height: ch } = scaledContent.getBoundingClientRect();
  let { width: ww, height: wh } = scaledWrapper.getBoundingClientRect();
  let scaleAmtX = Math.min(ww / cw, wh / ch);
  let scaleAmtY = scaleAmtX;
  scaledContent.style.transform = `scale(${scaleAmtX}, ${scaleAmtY})`;
};

function BillingContent() {
  const scaledWrapper = useRef();

  const [showInvoice, setShowInvoice] = useState(false);
  const [showTable, setShowTable] = useState(true);
  const { invoiceState, setInvoiceState } = useContext(InvoiceContext);

  return (
    <div className="w-full h-full gap-4 p-4 overflow-auto bg-white card rounded-2xl">
      <div className="items-end w-full justify-items-end">
        <button
          onClick={() => {
            setInvoiceState({
              Customer: { Name: "", Address: "" },
              Items: [],
              Discount: 0,
              OtherCharges: 0,
              isEditable: true,
              Date: new Date(),
            });
            setShowTable(false);
            setShowInvoice(true);
          }}
          className="btn btn-primary "
        >
          Create new Invoice
        </button>
      </div>
      <InvoiceSteps />
      <div className="flex flex-row justify-between w-full h-full">
        {showTable && (
          <div className={showInvoice ? "w-1/2" : "w-full"}>
            <DataTable
              hideInvoice={() => setShowInvoice(false)}
              showInvoice={() => setShowInvoice(true)}
              Title={"Pending Invoices"}
            />
          </div>
        )}
        {showInvoice ? (
          <div
            ref={scaledWrapper}
            className="flex flex-col w-full h-full origin-top "
          >
            <Invoice
              parentRef={scaledWrapper}
              onCancel={() => {
                setShowInvoice(false);
                setShowTable(true);
              }}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default function Billing() {
  return (
    <InvoiceProvider>
      <BillingContent />
    </InvoiceProvider>
  );
}
