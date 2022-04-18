import {
  collection,
  doc,
  getDocs,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useFirebaseApp } from "reactfire";
import GridListWithSearch from "./Elements/GridListWithSearch";
import moment from "moment";
import Invoice from "./Tabs/Invoice";
import ReactToPrint, { useReactToPrint } from "react-to-print";
import { InvoiceContext, InvoiceProvider } from "../context/InvoiceContext";

const calcProgress = ({ startDate, endDate }) => {
  const start = moment(startDate.toDate());
  const end = moment(endDate.toDate());
  const now = moment();
  const duration = moment.duration(end.diff(start));
  const days = duration.asDays();
  const progress = moment.duration(now.diff(start)).asDays() / days;
  return progress < 0 ? 0 : progress * 100;
};

export function ActiveAMCList(props) {
  const db = getFirestore(useFirebaseApp());
  const collectionRef = collection(db, "AMC");
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState({});
  const { invoiceState, setInvoiceState } = useContext(InvoiceContext);
  const [showInvoice, setShowInvoice] = useState(false);

  useEffect(() => {
    setLoading(true);
    var q;
    if (props.CustomerId) {
      q = query(
        collectionRef,
        where("Customer.id", "==", props.CustomerId),
        orderBy("NextInvoiceDate", "desc")
      );
    } else {
      q = query(collectionRef, orderBy("NextInvoiceDate", "desc"));
    }
    var unsub = onSnapshot(q, (snapshot) => {
      var val = snapshot.docs.map((doc) => {
        return { ...doc.data(), id: doc.id };
      });
      setItems(val);
    });
    return () => {
      unsub();
    };
  }, []);
  const handlePrint = (invId) => {
    selected.item.Quarters[selected.quarter].PrintedAt = Timestamp.fromDate(
      new Date()
    );
    selected.item.Quarters[selected.quarter].InvoiceId = invId;
    if (selected.quarter < 3) {
      selected.item.NextInvoiceDate =
        selected.item.Quarters[selected.quarter + 1].endDate;
    } else {
      selected.item.NextInvoiceDate = null;
    }
    updateDoc(doc(collectionRef, selected.item.id), selected.item);
  };
  const filteredItems = items.filter((item) => {
    return item.Customer.Name.toLowerCase().includes(search.toLowerCase());
  });
  return (
    <>
      <div className="w-full items-center">
        <div className="flex flex-col pt-4">
          <div className="flex w-full">
            <GridListWithSearch
            Title="Active Contracts"
              items={items}
              create={false}
              searchField={"Name"}
              setSelected={(val) => {
                setSelected(val);
                setShowInvoice(true);
              }}
            >
              {(item, setSelected) => {
                return (
                  <div className="flex w-full border-2 card card-compact hover:shadow-lg">
                    <div className="card-body">
                      <div className="flex items-center justify-between">
                        <p>
                          <span className="card-title">
                            {item.Customer && item.Customer.Name}
                          </span>
                          <span className="font-semibold">
                            {item.ContractNumber}
                          </span>
                        </p>
                       
                        <div className="flex w-fit btn-group">
                          {item.Quarters.map((quarter, idx) => (
                            <button
                              className={`btn w-fit  flex-col ${
                                item == selected.item && idx == selected.quarter
                                  ? "bg-neutral text-neutral-content"
                                  : ""
                              } ${
                                quarter.PrintedAt
                                  ? "btn-outline btn-success"
                                  : "btn-outline"
                              }`}
                              onClick={() => {
                                setInvoiceState({
                                  Customer: {
                                    Name: item.Customer.Name,
                                    Address: item.Customer.Address,
                                    id: item.Customer.id,
                                  },
                                  Items: [
                                    {
                                      Description:
                                        "AMC for the period " +
                                        moment(quarter.startDate.toDate()).format(
                                          "DD-MMMM-YYYY"
                                        ) +
                                        " to " +
                                        moment(quarter.endDate.toDate()).format(
                                          "DD-MMMM-YYYY"
                                        ),
                                      Units: 1,
                                      Rate: item.Amount / 4,
                                    },
                                  ],
                                  Discount: 0,
                                  OtherCharges: 0,
                                  isItemsEditable: quarter.InvoiceId
                                    ? false
                                    : true,
                                });
                                setSelected({ item, quarter: idx });
                              }}
                            >
                              <div>Phase {idx + 1}</div>
                              <div className="text-xs">
                                {moment(quarter.startDate.toDate()).format(
                                  "DD/MMM"
                                ) +
                                  " - " +
                                  moment(quarter.endDate.toDate()).format(
                                    "DD/MMM"
                                  )}
                              </div>
                              <progress
                                className="progress progress-accent"
                                value={calcProgress(quarter)}
                                max="100"
                              ></progress>
                            </button>
                          ))}
                        </div>
                      </div>
                      <div
                          className="btn w-fit self-end"
                          onClick={handlePrint}
                        >
                          {item.NextInvoiceDate &&
                            "Next Invoice: " +
                              moment(item.NextInvoiceDate.toDate()).format(
                                "DD/MMMM"
                              )}
                        </div>
                    </div>
                  </div>
                );
              }}
            </GridListWithSearch>
          </div>
        </div>
        {selected.item && (
          <div className="flex flex-col p-4">
            <Invoice onPrint={handlePrint} />
          </div>
        )}
      </div>
    </>
  );
}
