import React, { useState, useEffect } from "react";
import response from "../../utils/demo/tableData";
import CurrencyInput from "react-currency-input-field";
import {
  TableBody,
  TableContainer,
  Table,
  TableHeader,
  TableCell,
  TableRow as TableRow,
  TableFooter,
  Avatar,
  Badge,
  Pagination,
  Card,
  Label,
  Button,
  Input,
  Modal,
} from "@windmill/react-ui";
import {
  useFirebaseApp,
  useFirestoreCollectionData,
  useFirestoreDocData,
} from "reactfire";
import {
  getFirestore,
  query,
  collection,
  addDoc,
  serverTimestamp,
  orderBy,
  doc,
  updateDoc,
} from "firebase/firestore";

import { TrashIcon } from "../../icons";
import RoundIcon from "../../components/RoundIcon";
import { Textarea } from "@windmill/react-ui";
import CreatableSelect, { useCreatable } from "react-select/creatable";
import ExpenseDetailModal from "./ExpenseDetailModal";
import SettlementDetailsView from "./SettlementDetailsView";
import Loader from "../Elements/Loader";

function ExpenseRow({ isAdvance, idx, transaction }) {
  console.log(transaction);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  if (!transaction) {
    return null;
  }

  return (
    <>
      <Modal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        className="relative w-2/3 h-full overflow-auto scrollbar-thin scrollbar-thumb-purple-400 scrollbar-track-purple-100 scrollbar-thumb-rounded-full scrollbar-track-rounded-full"
      >
        {isDetailsOpen ? (
          <div className="absolute inset-x-0 bottom-10">
            <SettlementDetailsView
              transactions={[transaction]}
              onClose={() => setIsDetailsOpen(false)}
            />
          </div>
        ) : null}
      </Modal>
      <TableRow
        className="hover:bg-purple-200 "
        onClick={() => setIsDetailsOpen(true)}
      >
        <TableCell>
          <span className="text-sm font-bold">{transaction.RVNumber}</span>
        </TableCell>
        <TableCell>
          <div className="flex items-center text-sm">
            {isAdvance ? (
              <Avatar
                className="hidden mr-3 md:block"
                src={"https://ui-avatars.com/api/?name=" + transaction.Name}
                alt="User image"
              />
            ) : null}
            {isAdvance ? (
              <div>
                <div className="font-semibold">{transaction.Name}</div>
                <p className="text-xs text- gray-600 dark:text-gray-400">
                  {transaction.Employee.dept}
                </p>
              </div>
            ) : (
              <div>
                <div className="font-semibold">{transaction.Name}</div>
              </div>
            )}
          </div>
        </TableCell>
        <TableCell>
          <span className="text-sm">QAR {transaction.Amount}</span>
        </TableCell>
        <TableCell>
          {isAdvance ? (
            <Badge type={transaction.IsSettled ? "success" : "warning"}>
              {transaction.IsSettled ? "Settled" : "Pending"}
            </Badge>
          ) : (
            <span className="text-sm">{transaction.Desc}</span>
          )}
        </TableCell>
      </TableRow>
    </>
  );
}
function find(items, text) {
  text = text.split(" ");
  return items.filter(function (item) {
    return text.every(function (el) {
      return item.content.indexOf(el) > -1;
    });
  });
}

export function AddRow({
  RVNumber,
  setName,
  setAmt,
  setDesc,
  isAdvance,
  toggleFunction,
  empList,
  setEmployee,
}) {
  const empSelectList = empList.map((e, i) => {
    return { value: e.id, label: e.Name, dept: e.Dept };
  });
  var handleNameChange = (newValue, actionMeta) => {
    setName(newValue.label);
    setEmployee(newValue);
  };
  return (
    <TableRow className="">
      <TableCell className="font-bold text-primary ">{RVNumber}</TableCell>
      {isAdvance ? (
        <TableCell className="flex inset-y-10">
          <div className="w-48 ">
            <CreatableSelect
              isClearable
              theme={(theme) => ({
                ...theme,
                spacing: {
                  baseUnit: 2,
                  controlHeight: 38,
                  menuGutter: 4,
                },

                borderColor: "#d8b4fe",
                borderRadius: 8,
                colors: {
                  ...theme.colors,
                  primary25: "#e9d5ff",
                  primary: "#a855f7",
                },
              })}
              onChange={handleNameChange}
              // onInputChange={handleNameInputChange}
              options={empSelectList}
            />
          </div>
        </TableCell>
      ) : (
        <TableCell>
          <Input
            className="w-full px-2 py-2 text-sm placeholder-purple-300 transition-all duration-150 ease-linear border-2   shadow-md border-1 border-primary text-primary hover:shadow-lg focus:shadow-none focus-outline-purple-400"
            onChange={(e) => setName(e.target.value)}
          />
        </TableCell>
      )}
      <TableCell>
        <CurrencyInput
          className="w-full px-2 py-2 text-sm placeholder-purple-300 transition-all duration-150 ease-linear border-2   shadow-md border-1 border-primary text-primary hover:shadow-lg focus:shadow-none focus-outline-purple-400"
          prefix="QAR "
          id="advance-add-input"
          name="advance-add"
          placeholder="Amount"
          defaultValue={0}
          decimalsLimit={2}
          onValueChange={(value, name) => setAmt(value)}
        />
      </TableCell>
      <TableCell className="">
        <div className="flex flex-row justify-between w-full align-middle ">
          {isAdvance ? (
            <Badge type="warning">Pending</Badge>
          ) : (
            <Textarea
              onChange={(event) => {
                setDesc(event.target.value);
              }}
              className="mt-1 mr-4"
              rows="2"
            />
          )}

          <span
            className="w-4 mt-auto mb-auto ml-auto mr-0 text-purple-300 transition-all duration-150 ease-linear rounded-full hover:text-primary"
            aria-hidden="true"
          >
            <TrashIcon onClick={() => toggleFunction(false)} />
          </span>
        </div>
      </TableCell>
    </TableRow>
  );
}

export default function ExpenseCard({
  newRVNumber,
  isAdvance,
  addShown,
  setAddShown,
  addTransaction,
  data,
  status,
}) {
  const [showAddRow, setShowAddRow] = useState(false);

  const db = getFirestore(useFirebaseApp());
  const deptRef = collection(db, "Department");

  const q = query(deptRef, orderBy("Name"));
  var { statusEmp, data: employees } = useFirestoreCollectionData(q, {
    q,
    idField: "id", // this field will be added to the object created from each document
  });
  return (
    <TableContainer className="h-auto">
      <Table className="items-center w-full h-auto border-collapse table-fixed   bg-base-100 ">
        <TableHeader className="text-purple-100 bg-purple-600 ">
          <tr>
            {isAdvance ? (
              <>
                <TableCell className="w-1/5">RV Number</TableCell>
                <TableCell className="w-2/5">Employee</TableCell>
                <TableCell className="w-1/5">Amount</TableCell>
                <TableCell className="w-1/5">Status</TableCell>
              </>
            ) : (
              <>
                <TableCell className="w-1/6">RV Number</TableCell>
                <TableCell className="w-2/6">Name</TableCell>
                <TableCell className="w-1/6">Amount</TableCell>
                <TableCell className="w-2/6">Description</TableCell>
              </>
            )}
          </tr>
        </TableHeader>
        <TableBody className="divide-none ">
          {data.map((transaction, i) => (
            <ExpenseRow
              isAdvance={isAdvance}
              idx={i}
              transaction={transaction}
            />
          ))}
        </TableBody>
      </Table>
      {/* <TableFooter>
          <Pagination
            totalResults={transactions.length}
            resultsPerPage={resultsPerPage}
            label="Table navigation"
            onChange={onPageChange}
          />
        </TableFooter> */}
      <Button className="w-full h-full m-auto ">
        <span aria-hidden="true">
          {addShown ? "Save" : "Add"}
          {addShown ? "" : " +"}
        </span>
      </Button>
    </TableContainer>
  );
}

ExpenseCard.defaultProps = {
  isAdvance: false,
};
