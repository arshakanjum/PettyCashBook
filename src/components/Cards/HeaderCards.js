import React from "react";
import {
  collection,
  getFirestore,
  query,
  where,
  serverTimestamp,
  Timestamp,
  orderBy,
  doc,
  getDoc,
  onSnapshot,
} from "firebase/firestore";

import { useFirebaseApp, useFirestoreCollectionData } from "reactfire";
import Loader from "../Elements/Loader";

export default function HeaderCards(props) {
  var st = new Date();
  var en = new Date();
  st.setUTCHours(0, 0, 0, 0);
  const db = getFirestore(useFirebaseApp());
  const transRef = collection(db, "Transactions");
  var q = query(
    transRef,
    where("Date", ">=", st),
    where("Date", "<=", en),
    orderBy("Date", "desc")
  );
  const { status, data: d } = useFirestoreCollectionData(q, {
    q,
    idField: "id",
  });
  if (status === "loading") {
    return <Loader />;
  }
  var paidToday = d.reduce((acc, curr) => {
    acc += curr.Amount;
    return acc;
  }, 0);

  return (
    <div className="overflow-visible shadow stats">
      <div className="stat place-items-center">
        <div className="stat-title">Outstanding Advances</div>
        <div className="stat-value ">QAR 4,200</div>
        <div className="stat-desc ">↗︎ 40 (2%)</div>
      </div>

      <div className="bg-base-100 stat place-items-center">
        <div className="stat-title">Cash In Hand</div>
        <div className="stat-value text-primary">QAR 7,000</div>
        <div className="stat-actions">
          <label
            tabindex="0"
            className="m-1 btn"
            onClick={() => props.setIsAddMode(!props.isAddMode)}
          >
            Advance
          </label>

          <div className="dropdown">
            <label tabindex="0" className="m-1 btn">
              Direct Expense
            </label>
            <div
              tabindex="0"
              className="w-64 p-2 shadow dropdown-content card card-compact bg-primary text-primary-content"
            >
              <div className="card-body">
                <h3 className="card-title">Card title!</h3>
                <p>you can use any element as a dropdown.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="stat place-items-center">
        <div className="stat-title">Paid Today</div>
        <div className="stat-value">QAR {paidToday}</div>
        <div className="stat-desc">↘︎ 90 (14%)</div>
      </div>
    </div>
  );
}
