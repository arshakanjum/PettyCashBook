import React, { useState, useEffect } from "react";

import PageTitle from "../components/Typography/PageTitle";
import {
  useFirebaseApp,
  useFirestoreCollectionData,
  useFirestoreDocData,
} from "reactfire";
import {
  getDocs,
  getFirestore,
  where,
  query,
  collection,
  addDoc,
  serverTimestamp,
  orderBy,
  doc,
  updateDoc,
} from "firebase/firestore";
import CustomersList from "./CustomersList";
import Invoice from "../components/Tabs/Invoice";
import { InvoiceProvider } from "../context/InvoiceContext";
import Loader from "../components/Elements/Loader";
import DataTable from "../components/Elements/DataTable";
import { ActiveAMCList } from "../components/ActiveAMCList";


function partition(array, isValid) {
  return array.reduce(
    ([pass, fail], elem) => {
      return isValid(elem) ? [[...pass, elem], fail] : [pass, [...fail, elem]];
    },
    [[], []]
  );
}

function CustomerDetails(props) {
  const db = getFirestore(useFirebaseApp());
  const invoiceRef = collection(db, "Invoices");
  const [selectedTab, setSelectedTab] = useState(1)
  var q;
  if (props.selected)
    q = query(
      invoiceRef,
      where("Customer.id", "==", props.selected.id),
      orderBy("createdAt", "desc")
    );
  else q = query(invoiceRef, where("Customer.id", "==", null));

  const { status, data: Invoices } = useFirestoreCollectionData(q, {
    q,
    idField: "id", // this field will be added to the object created from each document
  });
  if (status == "loading") {
    return <Loader />;
  }
  var rec = Invoices.reduce((acc, invoice) => {
    if (!invoice.IsPaid) {
      acc += Number(invoice.Amount);
    }
    return acc;
  }, 0);
  var [paid, unpaid] = partition(
    Invoices,
    (invoice) => invoice.IsPaid
  );
  return (
    <>
      <PageTitle>{props.selected.Name}</PageTitle>
      <div className="flex flex-col h-full shrink-0	 w-full">
        <div className="self-center shadow-lg stats bg-neutral w-fit text-neutral-content h-fit shrink-0">
          <div className="stat">
            <div className="stat-title">Total Receivable</div>
            <div className="stat-value">QAR {rec}</div>
          </div>
        </div>
        <div class="tabs mx-auto mt-8">
  <a className={`tab tab-bordered ${selectedTab==1?"tab-active":""}`} onClick={()=>setSelectedTab(1)}>Invoices</a> 
  <a className={`tab tab-bordered ${selectedTab==2?"tab-active":""}`} onClick={()=>setSelectedTab(2)}>AMC</a> 
</div>
        {selectedTab==1 && <div>
         {unpaid.length>0&& <DataTable Invoices={unpaid} Title={"Pending Invoices"} />}
          {paid.length>0&& <DataTable Invoices={paid} Title={"Paid Invoices"} />}
        </div>}
        {selectedTab==2 && <ActiveAMCList CustomerId={props.selected.id} />}
      </div>
    </>
  );
}

function Customers() {
  const [selected, setSelected] = useState();
  return (
    <InvoiceProvider>
      <div className="flex flex-row w-full h-full bg-white card">
        <div className="w-1/2">
          <CustomersList setSelected={setSelected} />
        </div>
        <div className="divider divider-horizontal" />
        <div className="flex flex-col w-1/2 p-8 overflow-auto">
          {selected && <CustomerDetails selected={selected} />}
        </div>
      </div>
    </InvoiceProvider>
  );
}

export default Customers;
