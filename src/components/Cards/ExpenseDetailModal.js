import React, { useState, useEffect } from "react";
import { useReactToPrint } from "react-to-print";
import {
  Modal,
  Button,
  Label,
  Input,
  Textarea,
  TableContainer,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@windmill/react-ui";
import moment from "moment";
import {
  useFirebaseApp,
  useFirestoreCollectionData,
  useFirestoreDocData,
} from "reactfire";
import {
  getFirestore,
  collection,
  writeBatch,
  query,
  where,
  getDocs,
  addDoc,
  getDoc,
} from "firebase/firestore";
import SettlementCategories from "../Config/SettlementCategories";
import Select from "react-select";

import "react-nice-dates/build/style.css";
import NumberFormat from "react-number-format";
import ExpenseDetailHeader from "./ExpenseDetailHeader";
import UserDetailsView from "./UserDetailsView";
import { SpiralSpinner } from "react-spinners-kit";
import SettlementDetailsView from "./SettlementDetailsView";

function GenerateRV({
  transaction,
  selectedRadio,
  setSelectedRadio,
  isOriginal,
  projects,
}) {
  const [date, setDate] = useState();
  const [settlementCategory, setSettlementCategory] = useState("");
  const [settlementList, setSettlementList] = useState([]);
  const onChangeRadio = (event) => {
    console.log(event.target.value);
    setSelectedRadio(event.target.value);
  };
}
function partition(array, isValid) {
  return array.reduce(
    ([pass, fail], elem) => {
      return isValid(elem) ? [[...pass, elem], fail] : [pass, [...fail, elem]];
    },
    [[], []]
  );
}
function ExpenseDetailModal({ isOpen, onClose, Employee }) {
  const [data, setData] = useState([]);
  const db = getFirestore(useFirebaseApp());
  const transRef = collection(db, "Transactions");
  const q = query(
    transRef,
    where("Employee.value", "==", Employee.id ? Employee.id : Employee.value)
    // orderBy("Date", "desc")
  );
  useEffect(() => {
    var querySnapshot;
    var arr = [];
    async function fetchData() {
      querySnapshot = await getDocs(q);
      querySnapshot.forEach((transactionDoc) => {
        var transaction = transactionDoc.data();
        transaction.id = transactionDoc.id;
        arr.push(transaction);
      });

      setData(arr);
    }
    fetchData();
  }, []);
  if (data.length == 0) {
    return "Loading";
  }
  var [advance, direct] = partition(
    data,
    (transaction) => transaction.IsAdvance
  );
  return (
    <Modal
      isOpen={isOpen}
      onClose={() => onClose(false)}
      className="pt-8 w-2/3 h-screen overflow-auto scrollbar-thin scrollbar-thumb-purple-400 scrollbar-track-purple-100 scrollbar-thumb-rounded-full scrollbar-track-rounded-full"
    >
      <div className="flex flex-col   ">
        {direct.length > 0 ? (
          <ExpenseDetailHeader transactions={direct} />
        ) : (
          <SettlementDetailsView transactions={advance} />
        )}
      </div>
    </Modal>
  );
}

export default ExpenseDetailModal;
