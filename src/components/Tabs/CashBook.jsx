import React, { useState, useEffect } from "react";

import PageTitle from "../Typography/PageTitle";

import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import moment from "moment";
import Loader from "../Elements/Loader";
import TransactionCard from "../Cards/TransactionCard";
import { useFirebaseApp } from "reactfire";
import {
  collection,
  getDocs,
  getFirestore,
  query,
  updateDoc,
  where,
  serverTimestamp,
  Timestamp,
  orderBy,
  doc,
  getDoc,
  onSnapshot,
} from "firebase/firestore";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import SettlementDetailsView from "../Cards/SettlementDetailsView";
import HeaderCards from "../Cards/HeaderCards";
import { DisplayRVs } from "./DisplayRVs";

function OptionsFilterHeader(props) {
  return (
    <>
      {props.optionList.length > 0 &&
        props.optionList.map((option, i) => (
          <div
            className={
              props.selectedFilters.includes(option)
                ? "badge cursor-pointer m-1"
                : "badge badge-outline cursor-pointer m-1"
            }
            onClick={() => {
              if (props.selectedFilters.includes(option)) {
                props.setSelectedFilters(
                  props.selectedFilters.filter((item) => item !== option)
                );
                return;
              }

              props.setSelectedFilters([...props.selectedFilters, option]);
            }}
          >
            {option}
          </div>
        ))}
    </>
  );
}

const Tabs = {
  CASHBOOK: "Cashbook",
  EMPLOYEES: "Employees",
};

function CashBook() {
  const [activeTab, setActiveTab] = useState(Tabs.BILLING);
  const activeClass = "tab tab-bordered tab-active";
  const normalClass = "tab tab-bordered";
  var date = new Date();
  const db = getFirestore(useFirebaseApp());
  const transRef = collection(db, "Transactions");
  const empRef = collection(db, "Department");
  const setRef = collection(db, "Settlements");

  const animatedComponents = makeAnimated();
  const filterOptions = [
    "Advances",
    "Direct Expenses",
    "Settled",
    "Pending",
    "Balance Payment",
    "Balance Refund",
  ];

  const [dates, setDates] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  var [typeFilter, setTypeFilter] = useState([]);

  var [filteredList, setFilteredList] = useState([]);
  const [typeFilterLoading, setTypeFilterLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [employeeLoading, setEmployeeLoading] = useState(false);
  const [empFilter, setEmpFilter] = useState([]);
  const [selectedTransaction, setselectedTransaction] = useState("");
  const [settlement, setSettlement] = useState(null);
  const [showPicker, setShowPicker] = useState(false);
  const [isSettleMode, setIsSettleMode] = useState(false);
  const [isAddMode, setIsAddMode] = useState(false);
  const [paidToday, setPaidToday] = useState(0);

  useEffect(() => {
    async function getSettlement() {
      var q = query(
        setRef,
        where("Advances", "array-contains", selectedTransaction.id)
      );
      var querySnapshot;
      querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        querySnapshot.docs.forEach((doc) => {
          setSettlement({ id: doc.id, ...doc.data() });
        });
        setIsSettleMode(false);
      } else {
        setSettlement(null);
      }
    }
    setSettlement(null);
    if (!selectedTransaction) {
      return;
    }

    if (selectedTransaction && selectedTransaction.IsAdvance) {
      getSettlement();
    } else {
      setSettlement(null);
    }
  }, [selectedTransaction, isSettleMode]);

  useEffect(() => {
    async function fetchData() {
      var q = query(empRef);
      var snapshot = await getDocs(q);
      var val = [];
      snapshot.forEach((docs) => {
        if (!docs.data()["NO_ID_FIELD"]) {
          val.push({
            id: docs.id,
            label: docs.data().Name,
            value: docs.id,
            dept: docs.data().Dept,
          });
        }
      });
      setEmployees(val);
      setEmployeeLoading(false);
      return;
    }
    setEmployeeLoading(true);
    fetchData();
  }, []);

  useEffect(() => {
    if (empFilter.length == 0 && typeFilter.length == 0) {
      setFilteredList(transactions);
      setEmployeeLoading(false);
      return;
    }
    var newList = transactions;
    function setEmpFilter() {
      typeFilter.map((item) => {
        newList = newList.filter((transaction) => {
          switch (item) {
            case "Advances":
              return transaction.IsAdvance;
            case "Direct Expenses":
              return !transaction.IsAdvance;
            case "Settled":
              return transaction.IsAdvance && transaction.IsSettled;
            case "Pending":
              return transaction.IsAdvance && !transaction.IsSettled;
            case "Balance Payment":
              return transaction.Settlement.SettlementAmount > 0;
            case "Balance Refund":
              return transaction.Settlement.SettlementAmount < 0;
          }
        });
      });
      if (empFilter.length > 0) {
        newList = newList.filter((item) =>
          empFilter.includes(item.Employee.value)
        );
      }
      setFilteredList(newList);
      setEmployeeLoading(false);
      return;
    }
    setEmployeeLoading(true);
    setEmpFilter();
  }, [empFilter, typeFilter, transactions]);

  useEffect(() => {
    const fetch = async () => {
      var st = dates[0].startDate;
      var en = dates[0].endDate;
      st.setHours(0, 0, 0, 0);
      en.setHours(23, 59, 59, 999);
      if (en > new Date()) {
        en = new Date();
      }
      var q = query(
        transRef,
        where("Date", ">=", Timestamp.fromDate(st)),
        where("Date", "<=", Timestamp.fromDate(en)),
        orderBy("Date", "desc")
      );
      var snapshot = await getDocs(q);
      var val = [];
      snapshot.forEach((docs) => {
        val.push({
          id: docs.id,
          ...docs.data(),
        });
      });
      setTransactions(val);
    };
    fetch();
    setIsLoading(false);
  }, [dates]);

  useEffect(() => {
    setDates([
      {
        startDate: new Date(),
        endDate: new Date(),
        key: "selection",
      },
    ]);
  }, [isAddMode]);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <div className="flex justify-center align-middle">
            <HeaderCards setIsAddMode={setIsAddMode} paidToday={paidToday} />
          </div>

          <div className="flex justify-center mb-2 align-middle ">
            <div className="flex flex-col gap-4 max-w-lg ">
              <div className="flex flex-row justify-between align-middle">
                <PageTitle>Petty Cashbook</PageTitle>
                <div className="self-center btn-group ">
                  <button className="btn btn-active">Print Summary</button>
                </div>
              </div>
              <button
                className="text-lg font-semibold btn "
                onClick={() => setShowPicker(!showPicker)}
              >
                {dates[0].startDate?.toDateString() ===
                  dates[0].endDate.toDateString() &&
                dates[0].startDate.toDateString() === new Date().toDateString()
                  ? "Today"
                  : moment(dates[0].startDate).format("DD MMMM YYYY") +
                    " -> " +
                    moment(dates[0].endDate).format("DD MMMM YYYY")}
              </button>
              <div className="relative z-auto shadow-lg bg-base-300">
                {showPicker ? (
                  <DateRangePicker
                    rangeColors={["#9061f9"]}
                    onChange={(item) => setDates([item.selection])}
                    showSelectionPreview={true}
                    moveRangeOnFirstSelection={false}
                    retainEndDateOnFirstSelection={true}
                    months={3}
                    ranges={dates}
                    direction="vertical"
                    showDateDisplay={false}
                    maxDate={new Date()}
                    calendarFocus="backwards"
                    startDatePlaceholder={"Start Date"}
                    endDatePlaceholder={"End Date"}
                  />
                ) : null}
              </div>
              <div className="inline-grid h-fit w-full grid-cols-4 gap-2 scrollbar scrollbar-thumb-gray-900 scrollbar-track-gray-100">
                <div className="col-span-2 text-primary">
                  <div className="label">
                    <span>Employee</span>
                    <Select
                      isMulti
                      isClearable
                      isLoading={employeeLoading}
                      closeMenuOnSelect={false}
                      components={animatedComponents}
                      theme={(theme) => ({
                        ...theme,
                        spacing: {
                          baseUnit: 2,
                          controlHeight: 38,
                          menuGutter: 4,
                        },
                        borderColor: "#9061f9",
                        borderRadius: 8,
                        colors: {
                          ...theme.colors,
                          primary25: "#dccdfd",
                          primary: "#9061f9",
                        },
                      })}
                      onChange={(newValue) => {
                        console.log(newValue.map((a) => a.id));
                        setEmpFilter(newValue.map((a) => a.id));
                      }}
                      options={employees}
                    />
                  </div>
                </div>
                <div className="col-span-2 text-primary"></div>
                <div className="flex flex-row flex-wrap col-span-4">
                  <OptionsFilterHeader
                    optionList={filterOptions}
                    selectedFilters={typeFilter}
                    setSelectedFilters={setTypeFilter}
                  />
                </div>
              </div>
              <div className="w-full h-screen overflow-y-auto scroll-smooth">
                <div className="flex flex-col flex-grow w-full overflow-y-auto justify-items-start dark:bg-gray-800">
                  {filteredList.map((transaction) => (
                    <>
                      <TransactionCard
                        t={transaction}
                        onClick={() => {
                          // setIsSettleMode(false);
                          if (selectedTransaction == transaction) {
                            setselectedTransaction(null);
                          } else {
                            setselectedTransaction(transaction);
                          }
                        }}
                        isSelected={selectedTransaction == transaction}
                        showPrintBtn={false}
                        collapsed={true}
                        showDate={false}
                      />
                    </>
                  ))}
                </div>
              </div>
            </div>
            {selectedTransaction ? (
              !isSettleMode ? (
                <DisplayRVs
                  selectedTransaction={selectedTransaction}
                  settlement={settlement}
                  setIsSettleMode={setIsSettleMode}
                />
              ) : (
                <div className="right-0 flex flex-col">
                  <SettlementDetailsView
                    transactions={[selectedTransaction]}
                    onSaveSettlement={() => setIsSettleMode(false)}
                  />
                </div>
              )
            ) : null}
          </div>
        </>
      )}
    </>
  );
}

export default CashBook;
