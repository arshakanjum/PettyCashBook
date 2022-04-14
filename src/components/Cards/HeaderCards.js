import React, { useEffect, useState } from "react";
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
  getDocs,
  Transaction,
} from "firebase/firestore";

import { useFirebaseApp, useFirestoreCollectionData } from "reactfire";
import Loader from "../Elements/Loader";
import AddExpenseCard from "./AddExpenseCard";

export default function HeaderCards(props) {
  const [loading, setLoading] = useState(true);
  const [todaysTransactions, setTodaysTransactions] = useState([]);
  const db = getFirestore(useFirebaseApp());
  const transRef = collection(db, "Transactions");
  const [isAddMode, setIsAddMode] = useState(false);
  const [isAdvance, setisAdvance] = useState(false);
  useEffect(() => {
    async function fetchData() {
      var st = new Date();
      st.setHours(0, 0, 0, 0);
      var en = new Date();
      var q = query(transRef, where("Date", ">=", st), where("Date", "<=", en));
      var snapshot = await getDocs(q);
      var val = [];
      snapshot.forEach((docs) => {
        if (!docs.data()["NO_ID_FIELD"]) {
          val.push({
            id: docs.id,
            ...docs.data(),
          });
        }
      });
      setTodaysTransactions(val);
      return;
    }
    fetchData();
    setLoading(false);
  }, []);

  if (loading) {
    return <Loader />;
  }
  var paidToday = 0;
  var paidToday = todaysTransactions.reduce((acc, curr) => {
    acc += Number(curr.Amount);
    return acc;
  }, 0);
  return (
    <div className="flex flex-col">
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
              onClick={() => {
                setisAdvance(true);
                if (isAdvance) setIsAddMode(!isAddMode);
                props.setIsAddMode(true);
              }}
            >
              Advance
            </label>

            <div className="dropdown">
              <label
                tabindex="0"
                className="m-1 btn"
                onClick={() => {
                  setisAdvance(false);
                  if (!isAdvance) setIsAddMode(!isAddMode);
                  props.setIsAddMode(true);
                }}
              >
                Direct Expense
              </label>
            </div>
          </div>
        </div>

        <div className="stat place-items-center">
          <div className="stat-title">Paid Today</div>
          <div className="stat-value">QAR {paidToday}</div>
          <div className="stat-desc">↘︎ 90 (14%)</div>
        </div>
      </div>
      {isAddMode ? (
        <div className="mx-auto mt-2 w-96 justify-self-center card bg-primary text-primary-content">
          <div className="card-body">
            <AddExpenseCard
              isAdvance={isAdvance}
              onSave={() => {
                setIsAddMode(false);
                props.setIsAddMode(false);
              }}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
