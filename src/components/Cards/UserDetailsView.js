import React, { useState, useEffect } from "react";
import { Card, CardBody, Avatar, Button } from "@windmill/react-ui";
import moment from "moment";
import SettlementDetailsView from "./SettlementDetailsView";
import Loader from "../Elements/Loader";
import {
  collection,
  getDocs,
  getFirestore,
  query,
  QuerySnapshot,
  where,
} from "firebase/firestore";
import { useFirebaseApp } from "reactfire";
import TransactionCard from "./TransactionCard";

function partition(array, isValid) {
  return array.reduce(
    ([pass, fail], elem) => {
      return isValid(elem) ? [[...pass, elem], fail] : [pass, [...fail, elem]];
    },
    [[], []]
  );
}
function UserDetailsView(props) {
  const db = getFirestore(useFirebaseApp());
  const TransactionsRef = collection(db, "Transactions");

  const [selected, setSelected] = useState([]);
  const [isSettled, setIsSettled] = useState(false);
  const [addMode, setAddMode] = useState(false);
  const [transactions, setTransactions] = useState([]);

  const addToSelected = (transaction) => {
    if (selected.includes(transaction)) {
      var arr = selected.filter(function (tr) {
        return transaction.id !== tr.id;
      });
      setSelected(arr);
    }
    if (
      selected.length == 0 ||
      selected[0].IsSettled != transaction.IsSettled
    ) {
      setSelected([transaction]);
    } else if (!selected.includes(transaction)) {
      if (transaction.IsSettled) {
        setSelected([transaction]);
      } else {
        setSelected([...selected, transaction]);
      }
    }
  };
  useEffect(() => {
    var querySnapshot;
    var arr = [];
    async function fetchData() {
      var q = query(
        TransactionsRef,
        where("Employee.value", "==", props.Employee.id)
      );
      querySnapshot = await getDocs(q);
      querySnapshot.forEach((transactionDoc) => {
        var transaction = transactionDoc.data();
        transaction.id = transactionDoc.id;
        arr.push(transaction);
      });
      setTransactions(arr);
    }
    fetchData();
  }, [props.Employee]);

  if (transactions.length === 0) {
    return <Loader />;
  }

  var [settled, unsettled] = partition(
    transactions,
    (transaction) => transaction.IsSettled
  );
  const totalOutstanding = unsettled.reduce(
    (previousValue, currentValue) =>
      previousValue + Number(currentValue.Amount),
    Number(0)
  );
  return (
    <>
      <Card className="border-b-2 border-primary shadow-xl ">
        <CardBody>
          <div className="text-sm ">
            <div>
              <div className="flex flex-row items-center align-middle">
                <Avatar
                  className="hidden mr-3 md:block"
                  src={
                    "https://ui-avatars.com/api/?name=" + props.Employee.Name
                  }
                  alt="User image"
                />
                <p className="text-lg font-semibold text-gray-700 dark:text-gray-200 ">
                  {props.Employee.Name}
                </p>
              </div>
              <div className="justify-end w-full text-right ">
                <p>
                  <span>Total Outstanding</span>:{" "}
                  <span className="text-lg font-medium text-right">
                    QAR {totalOutstanding}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
      <div className="h-full pl-8 pr-8 bg-base-100 rounded-lg">
        {settled.length > 0 ? (
          <div className="flex justify-between w-full">
            <div className="p-2 text-lg font-medium text-gray-700 dark:text-gray-200">
              Settled Advances
            </div>
          </div>
        ) : null}

        <div className="flex flex-wrap -mx-4">
          {settled.map((transaction) => (
            <TransactionCard
              t={transaction}
              onClick={addToSelected}
              showPrintBtn={false}
              isSelected={selected.includes(transaction) ? true : false}
            />
          ))}
        </div>
        {unsettled.length > 0 ? (
          <div className="flex justify-between w-full">
            <div className="p-2 text-lg font-medium text-gray-700 dark:text-gray-200">
              Outstanding Advances
            </div>{" "}
          </div>
        ) : null}

        <div className="flex flex-row -mx-4 ">
          {unsettled.map((transaction) => (
            <TransactionCard
              t={transaction}
              onClick={addToSelected}
              showPrintBtn={true}
              isSelected={selected.includes(transaction) ? true : false}
            />
          ))}
        </div>
      </div>

      <div className="mt-2">
        {selected.length > 0 ? (
          <SettlementDetailsView
            transactions={selected}
            IsSettled={isSettled}
            onClose={() => setAddMode(false)}
            showTransactions={false}
          />
        ) : null}
      </div>
    </>
  );
}

export default UserDetailsView;
