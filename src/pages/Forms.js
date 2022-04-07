import React, { useState, useEffect } from "react";

import PageTitle from "../components/Typography/PageTitle";
import { Input, HelperText, Label, Textarea } from "@windmill/react-ui";

import { EditIcon, MailIcon } from "../icons";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import moment from "moment";
import { Button, Transition } from "@windmill/react-ui";
import Loader from "../components/Elements/Loader";
import TransactionCard from "../components/Cards/TransactionCard";
import { useFirebaseApp } from "reactfire";
import {
  collection,
  getDocs,
  getFirestore,
  query,
  QuerySnapshot,
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
import SettlementCategories from "../components/Config/SettlementCategories";
import ReceiptVoucher from "../components/Cards/ReceiptVoucher";
import SlideUpAnimation from "../components/Elements/SlideUpAnimation";
import AddExpenseCard from "../components/Cards/AddExpenseCard";
import { sl } from "date-fns/locale";
import SettlementDetailsView from "../components/Cards/SettlementDetailsView";
import { getUnixTime } from "date-fns";
import HeaderCards from "../components/Cards/HeaderCards";

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

function Forms() {
  var date = new Date();
  const db = getFirestore(useFirebaseApp());
  const transRef = collection(db, "Transactions");
  const empRef = collection(db, "Department");

  const filterOptions = [
    "Advances",
    "Direct Expenses",
    "Settled",
    "Pending",
    "Balance Payment",
    "Balance Refund",
  ];

  const animatedComponents = makeAnimated();
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
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [employeeLoading, setEmployeeLoading] = useState(false);
  const [empFilter, setEmpFilter] = useState([]);
  const [selectedTransaction, setselectedTransaction] = useState(null);
  const [settlement, setSettlement] = useState(null);
  const [showPicker, setShowPicker] = useState(false);
  const [isSettleMode, setIsSettleMode] = useState(false);
  const [isAddMode, setIsAddMode] = useState(false);
  const [paidToday, setPaidToday] = useState(0);
  useEffect(() => {
    async function getSettlement() {
      const settlementID = selectedTransaction.Settlement.id;
      var querySnapshot;
      var docRef = doc(db, "Settlements", settlementID);
      querySnapshot = await getDoc(docRef);
      if (querySnapshot.data()) {
        var settlement = querySnapshot.data();
        setSettlement(settlement);
        setIsSettleMode(false);
      }
    }
    if (!selectedTransaction) {
      setSettlement(null);
      return;
    }

    if (
      selectedTransaction &&
      selectedTransaction.IsAdvance &&
      selectedTransaction.IsSettled
    ) {
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
            ...docs.data(),
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
    var st = new Date(dates[0].startDate);
    var en = new Date(dates[0].endDate);
    st.setUTCHours(0, 0, 0, 0);
    if (en > new Date()) {
      en = new Date();
    }

    // var startfulldate = new Timestamp(Date(st.setUTCHours(0, 0, 0, 0)));
    // var endfulldate = new Timestamp(Date(en.setUTCHours(23, 59, 59, 999)));
    var q = query(
      transRef,
      where("Date", ">=", st),
      where("Date", "<=", en),
      orderBy("Date", "desc")
    );
    var handleSnapshot = async (snapshot) => {
      snapshot.forEach((docs) => {
        val.push({ ...docs.data(), id: docs.id });
      });
      setTransactions(val);
      setIsLoading(false);
    };

    var val = [];
    var snap = getDocs(q).then(handleSnapshot);
  }, [dates]);

  useEffect(() => {
    if (isAddMode) {
      var st = new Date();
      var en = new Date();
      st.setUTCHours(0, 0, 0, 0);
      var q = query(
        transRef,
        where("Date", ">=", st),
        where("Date", "<=", en),
        orderBy("Date", "desc")
      );
      var val = 0;
      var fetch = async () => {
        var snapshot = await getDocs(q);
        snapshot.forEach((docs) => {
          val += Number(docs.data().Amount);
        });
        setPaidToday(val);
      };
      fetch();
    }
  }, [isAddMode, transactions]);

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
            <HeaderCards
              isAddMode={isAddMode}
              setIsAddMode={setIsAddMode}
              paidToday={paidToday}
            />
          </div>
          {isAddMode ? (
            <div className="mt-2 justify-self-center card w-96 bg-primary text-primary-content">
              <div className="card-body">
                <AddExpenseCard
                  isAdvance={true}
                  onSave={() => {
                    setIsAddMode(false);
                  }}
                />
              </div>
            </div>
          ) : null}
          <div className="flex justify-center align-middle max-h-fit">
            <div className="flex flex-col max-w-lg">
              <div className="flex flex-row justify-between align-middle">
                <PageTitle>Petty Cashbook</PageTitle>
                <div className="self-center btn-group ">
                  <button className="btn btn-active">Print Summary</button>
                </div>
              </div>
              <button
                className="text-lg font-semibold btn"
                iconRight={EditIcon}
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
              <div
                className="relative z-auto shadow-lg bg-base-300"
                onBlur={() => setShowPicker(false)}
              >
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
              <div className="inline-grid w-full grid-cols-4 gap-2 ">
                <div className="col-span-2 rounded-lg text-primary">
                  <Label>
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
                  </Label>
                </div>
                <div className="col-span-2 rounded-lg text-primary"></div>
                <div className="flex flex-row flex-wrap col-span-4">
                  <OptionsFilterHeader
                    optionList={filterOptions}
                    selectedFilters={typeFilter}
                    setSelectedFilters={setTypeFilter}
                  />
                </div>
              </div>
              <div className="flex flex-row w-full">
                <div className="flex flex-col w-full overflow-y-auto justify-items-start dark:bg-gray-800">
                  {filteredList.map((transaction) => (
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
                  ))}
                </div>
              </div>
            </div>
            {selectedTransaction ? (
              !isSettleMode ? (
                <div className="right-0 flex flex-col">
                  <div className="self-end p-4 pb-0 btn-group ">
                    <button className="btn btn-active">Print RV</button>
                    {selectedTransaction.IsSettled ? (
                      <button className="btn">Print Settlement RV</button>
                    ) : (
                      <button
                        className="btn"
                        onClick={() => setIsSettleMode(true)}
                      >
                        Settle
                      </button>
                    )}
                  </div>
                  <div className="flex flex-row items-baseline gap-4 p-4 ">
                    <SlideUpAnimation on={selectedTransaction !== null}>
                      <div className="border-2 border-black bg-base-100 artboard phone-3 ">
                        <ReceiptVoucher
                          transaction={selectedTransaction}
                          isSettlement={false}
                        />
                      </div>
                    </SlideUpAnimation>
                    <SlideUpAnimation on={settlement !== null}>
                      <div className="border-2 border-black bg-base-100 artboard phone-3 ">
                        <ReceiptVoucher
                          transaction={settlement}
                          isSettlement={true}
                        />
                      </div>
                    </SlideUpAnimation>
                  </div>
                </div>
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

export default Forms;
