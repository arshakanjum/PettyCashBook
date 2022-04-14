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

export function ActiveAMCList({}) {
  const db = getFirestore(useFirebaseApp());
  const collectionRef = collection(db, "AMC");
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState({});
  const { invoiceState, setInvoiceState } = useContext(InvoiceContext);
  useEffect(() => {
    setLoading(true);
    const q = query(collectionRef, orderBy("NextInvoiceDate", "desc"));
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
  const handleSearch = (val) => {
    setSearch(val);
  };
  const handlePrint = () => {
    selected.item.Quarters[selected.quarter].PrintedAt = Timestamp.fromDate(
      new Date()
    );
    if (selected.quarter < 3) {
      selected.item.NextInvoiceDate =
        selected.item.Quarters[selected.quarter + 1].endDate;
    } else {
      selected.item.NextInvoiceDate = null;
    }
    updateDoc(doc(collectionRef, selected.item.id), selected.item);
  };
  const filteredItems = items.filter((item) => {
    return item.Name.toLowerCase().includes(search.toLowerCase());
  });
  return (
    <>
      <div className="flex flex-row">
        <div className="w-1/2">
          <div className="mb-2 text-2xl font-semibold ">Active Contracts</div>
          <GridListWithSearch
            items={items}
            create={false}
            searchField={"Name"}
            setSelected={setSelected}
          >
            {(item, setSelected) => {
              return (
                <div className="flex w-full m-2 border-2 card card-compact hover:shadow-lg">
                  <div class="card-body">
                    <div class="flex justify-between items-center w-full">
                      <p>
                        <span className="card-title">{item.Name}</span>
                        <span className="font-semibold">
                          {item.ContractNumber}
                        </span>
                      </p>
                      <div
                        class="btn btn-xs btn-primary btn-outline"
                        onClick={handlePrint}
                      >
                        {item.NextInvoiceDate &&
                          "Next Invoice: " +
                            moment(item.NextInvoiceDate.toDate()).format(
                              "DD/MMMM"
                            )}
                      </div>
                    </div>
                    <div class="btn-group w-full flex">
                      {item.Quarters.map((quarter, idx) => (
                        <button
                          className={`btn w-1/4  flex flex-col ${
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
                              CustomerName: item.Name,
                              CustomerAddress: item.Address,
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
                              moment(quarter.endDate.toDate()).format("DD/MMM")}
                          </div>
                          <progress
                            class="progress progress-accent"
                            value={calcProgress(quarter)}
                            max="100"
                          ></progress>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              );
            }}
          </GridListWithSearch>
        </div>
        {selected.item && (
          <div className="flex w-1/2 p-4">
            <div className="flex justify-center mx-auto">
              <Invoice
                onPrint={() => {
                  handlePrint();
                }}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
