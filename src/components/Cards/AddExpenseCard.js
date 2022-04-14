import React, { useState, useEffect } from "react";
import {
  Button,
  Label,
  Input,
  Textarea,
  TableContainer,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
  Badge,
} from "@windmill/react-ui";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  getFirestore,
  orderBy,
  query,
  QuerySnapshot,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import CurrencyInput from "react-currency-input-field";
import CreatableSelect, { useCreatable } from "react-select/creatable";
import { useFirebaseApp } from "reactfire";
import { TrashIcon } from "../../icons";
import { getNewRVNumber, textIndexToArray } from "../../firebase";

export default function AddExpenseCard({ isAdvance, onSave }) {
  const [RVNumber, setRVNumber] = useState("");
  getNewRVNumber().then((res) => {
    setRVNumber(res);
  });
  const db = getFirestore(useFirebaseApp());
  const [employees, setEmployees] = useState([]);
  const collectionRef = collection(db, "Transactions");
  useEffect(() => {
    var fetchEmployees = async () => {
      var snap = await getDocs(
        query(collection(db, "Department"), orderBy("Name"))
      );
      var empList = [];
      snap.forEach((doc) => {
        empList.push({ ...doc.data(), id: doc.id });
      });
      setEmployees(empList);
    };
    fetchEmployees();
  }, []);

  const addTransaction = async () => {
    var arg = {
      Name: Name,
      Amount: Amount,
      Date: Timestamp.fromDate(new Date()),
      Desc: Desc,
      RVNumber: RVNumber,
      Employee: Emp,
      IsAdvance: isAdvance,
      IsSettled: false,
      Name: Emp.label,
    };
    await addDoc(collectionRef, arg);
    await updateDoc(doc(collectionRef, "RVNumber"), { RVNumber: arg.RVNumber });
  };

  const empSelectList = employees.map((e, i) => {
    return { value: e.id, label: e.Name, dept: e.Dept };
  });
  var handleNameChange = (newValue, actionMeta) => {
    setName(newValue.label);
    setEmployee(newValue);
  };
  var Name,
    Amount,
    Desc = "",
    Emp = "";
  const setName = (val) => {
    Name = val;
  };
  const setAmt = (val) => {
    Amount = val;
  };
  const setDesc = (val) => {
    Desc = val;
  };
  const setEmployee = (val) => {
    Emp = val;
  };
  const colourStyles = {
    control: (styles) => ({
      ...styles,
      backgroundColor: "white",
      width: "200px",
    }),
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
      const color = "white";
      return {
        ...styles,
        color: "#000",
        cursor: isDisabled ? "not-allowed" : "default",
      };
    },
  };
  return (
    <div className="flex flex-col gap-2 align-middle w-80">
      <div className="col-span-1 text-xl font-medium w-">{RVNumber}</div>
      <label className="flex label">
        <span className="text-white label-text">Employee</span>
        <CreatableSelect
          styles={colourStyles}
          onChange={handleNameChange}
          // onInputChange={handleNameInputChange}
          options={empSelectList}
        />
      </label>

      <label className="label">
        <span className="text-white label-text">Amount</span>
        <CurrencyInput
          className="w-32 px-2 py-2 text-sm placeholder-purple-300 transition-all duration-150 ease-linear border-2   shadow-md border-1 border-primary text-primary hover:shadow-lg focus:shadow-none focus-outline-purple-400"
          prefix="QAR "
          id="advance-add-input"
          name="advance-add"
          placeholder="Amount"
          defaultValue={0}
          decimalsLimit={2}
          onValueChange={(value, name) => setAmt(value)}
        />
      </label>

      {isAdvance ? (
        <Badge type="warning">Pending</Badge>
      ) : (
        <>
          <label className="label">
            <span className="text-white align-top label-text">Description</span>
            <textarea
              class="textarea  "
              placeholder="Description"
              onChange={(event) => {
                setDesc(event.target.value);
              }}
            ></textarea>
          </label>
        </>
      )}

      <div className="justify-end card-actions">
        <button
          className="btn "
          onClick={() => {
            onSave();
            addTransaction();
          }}
        >
          Save
        </button>
      </div>
    </div>
    //   {isAdvance ? (
    //     <TableCell className="flex inset-y-10">
    //       <div className="w-48 ">

    //       </div>
    //     </TableCell>
    //   ) : (
    //     <TableCell>
    //
    //     </TableCell>
    //   )}
    //   <TableCell>

    //   </TableCell>
    //   <TableCell className="">

    //   </TableCell>
    // </TableRow>
  );
}
