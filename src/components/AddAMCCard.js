import React, { useEffect, useState } from "react";
import { Calendar, DateRange, DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css";
import { BsCalendar2Range } from "react-icons/bs";
import moment from "moment";
import DateChunk from "../utils/DateChunk";
import { et } from "date-fns/locale";
import {
  addDoc,
  collection,
  getFirestore,
  Timestamp,
} from "firebase/firestore";
import { useFirebaseApp } from "reactfire";
export default function AddAMCCard({}) {
  const db = getFirestore(useFirebaseApp());
  const AMCRef = collection(db, "AMC");
  const [loading, setLoading] = useState(false);
  const [ContractNumber, setContractNumber] = useState("");
  const [Amount, setAmount] = useState(0);
  const [Name, setName] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const [quarters, setQuarters] = useState([]);
  const [showQuarters, setShowQuarters] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [dates, setDates] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  useEffect(() => {
    if (dates[0].startDate != dates[0].endDate) {
      setQuarters(DateChunk(dates[0].startDate, dates[0].endDate, 4));
    }
  }, [dates]);

  const onCreate = async () => {
    await addDoc(AMCRef, {
      ContractNumber,
      Amount: Number(Amount),
      Name,
      StartDate: Timestamp.fromDate(dates[0].startDate),
      EndDate: Timestamp.fromDate(dates[0].endDate),
      Quarters: [...quarters],
      NextInvoiceDate: Timestamp.fromDate(quarters[0].endDate),
      CreatedAt: Timestamp.fromDate(new Date()),
    });

    setContractNumber("");
    setAmount(0);
    setName("");
    setDates([
      {
        startDate: new Date(),
        endDate: new Date(),
        key: "selection",
      },
    ]);
    setShowPicker(false);
    setShowQuarters(false);
  };
  return (
    <>
      {isExpanded ? (
        <div className="border-2 shadow-lg card">
          <div class="card-body">
            <div class="card-actions justify-end">
              <button
                class="btn btn-square btn-sm"
                onClick={() => {
                  setIsExpanded(false);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 p-2 form-control">
              <label className="input-group input-group-vertical">
                <span>Contract Number</span>
                <input
                  type="text"
                  className="input input-bordered"
                  value={ContractNumber}
                  onChange={(e) => setContractNumber(e.target.value)}
                />
              </label>
              <label className="input-group input-group-vertical">
                <span>Contract Amount</span>
                <label class="input-group">
                  <span>QAR</span>
                  <input
                    type="number"
                    className="w-full input input-bordered"
                    value={Amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </label>
              </label>
              <label className="input-group input-group-vertical">
                <span>Client Name</span>
                <input
                  value={Name}
                  type="text"
                  className="input input-bordered"
                  onChange={(e) => setName(e.target.value)}
                />
              </label>
              <label className="input-group input-group-vertical">
                <span>Period of Contract</span>
                <label className="input-group ">
                  <input
                    type="text"
                    placeholder="Start Date - End Date"
                    className="w-full input input-bordered"
                    value={
                      moment(dates[0].startDate).format("DD-MMM-YY") +
                      " - " +
                      moment(dates[0].endDate).format("DD-MMM-YY")
                    }
                  />
                  <button
                    className="btn"
                    onClick={() => setShowPicker(!showPicker)}
                  >
                    <BsCalendar2Range />
                  </button>
                </label>
              </label>

              {showPicker ? (
                <div className="z-auto flex col-span-2 p-4 transition ease-in-out delay-150 border-2 rounded-lg shadow-md">
                  <DateRangePicker
                    displayMode="dateRange"
                    showSelectionPreview={true}
                    onChange={(item) => {
                      setDates([item.selection]);
                      setShowQuarters(true);
                    }}
                    moveRangeOnFirstSelection={false}
                    retainEndDateOnFirstSelection={true}
                    months={4}
                    ranges={dates}
                    direction="horizontal"
                    showDateDisplay={true}
                    startDatePlaceholder={"Start Date"}
                    endDatePlaceholder={"End Date"}
                  />
                </div>
              ) : showQuarters > 0 ? (
                <div className="z-auto flex col-span-2 p-4 transition ease-in-out delay-150 border-2 rounded-lg shadow-md">
                  <DateRange
                    ranges={quarters}
                    onChange={(item) => {}}
                    months={4}
                    direction="horizontal"
                    showMonthAndYearPickers={false}
                    showPreview={false}
                    showDateDisplay={false}
                  />
                </div>
              ) : null}
            </div>
          </div>
          <div class="card-actions justify-end pr-8 pb-4">
            <button
              className={`btn btn-primary ${loading ? "loading" : ""}`}
              onClick={() => {
                setLoading(true);
                onCreate();
                setLoading(false);
              }}
            >
              Save
            </button>
          </div>
        </div>
      ) : (
        <button
          className={`w-full btn btn-primary ${loading ? "loading" : ""}`}
          onClick={() => {
            setIsExpanded(true);
          }}
        >
          Create new AMC
        </button>
      )}
    </>
  );
}
