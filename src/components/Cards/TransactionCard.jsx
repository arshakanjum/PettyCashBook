import React, { useState, useRef, useEffect } from "react";
import Loader from "../Elements/Loader";
import {
  collection,
  getDocs,
  getFirestore,
  query,
  QuerySnapshot,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { useFirebaseApp } from "reactfire";
import { useReactToPrint } from "react-to-print";
import moment from "moment";
import { Button } from "@windmill/react-ui";
import ConfirmationModal from "./ConfirmationModal";
import ReceiptVoucher from "./ReceiptVoucher";

function TransactionCard({
  t,
  onClick,
  isSelected,
  showPrintBtn,
  collapsed,
  showDate,
}) {
  const [selectedRadio, setSelectedRadio] = useState("");
  const db = getFirestore(useFirebaseApp());
  const transRef = collection(db, "Transactions");
  const setRef = collection(db, "Settlements");
  const [transaction, setTransaction] = useState(null);
  const [confirmationModalVisible, setConfirmationModalVisible] =
    useState(false);
  const [printingLoading, setPrintingLoading] = useState(false);
  const [settlement, setSettlement] = useState(null);

  const [loading, setLoading] = useState(true);
  const componentRef = useRef();
  if (transaction) {
    var docRef = doc(transRef, transaction.id);
  }

  useEffect(() => {
    setTransaction(t);
    setLoading(false);
    return () => {
      setTransaction(null);
    };
  }, [t]);

  var handlePrint = useReactToPrint({
    content: () => componentRef.current,
    onAfterPrint: () => {
      updateDoc(docRef, {
        IsPrinted: true,
        CashReceivedIn: selectedRadio,
        PrintTime: serverTimestamp(),
      }).then(() => {
        onClick(transaction);
        setLoading(false);
      });
    },
  });

  var onClickPrint = () => {
    setLoading(true);
    handlePrint();
  };
  if (!transaction) {
    return null;
  }
  if (loading) {
    return (
      <div className="block w-full p-2 transition-all   bg-base-100 ">
        <Loader />
      </div>
    );
  }
  return (
    <div
      onClick={() => onClick(transaction)}
      className={`card p-2 m-2  shadow-sm border-l-2  +
        ${isSelected ? " shadow-lg bg-neutral text-neutral-content " : ""} +
        ${
          transaction.IsAdvance
            ? transaction.IsSettled
              ? "border-green-300"
              : "border-red-400"
            : "border-blue-300"
        }`}
    >
      <div
        // onClick={() => onClick(transaction)}
        tabindex="0"
        className={isSelected ? null : null}
      >
        {showDate ? (
          <div className="p-2 mb-2 text-sm font-medium text-center align-middle rounded-full bg-neutral dark:text-gray-200 ">
            {moment(transaction.Date.toDate()).format("DD-MM-YY")}
          </div>
        ) : null}
        <div>
          <div className="flex justify-between">
            <div className="flex flex-col">
              <p className="font-semibold text-md ">{transaction.RVNumber}</p>

              <div className="text-sm text-left ">
                Expense: QAR{" "}
                <span className="font-semibold text-md">
                  {transaction.Amount}
                </span>
              </div>
              {transaction.IsAdvance &&
              transaction.IsSettled &&
              transaction.Settlement ? (
                <>
                  <div className="text-sm text-left ">
                    Settlement: QAR{" "}
                    <span className="font-semibold text-md">
                      {transaction.Settlement.SettlementAmount}
                    </span>
                  </div>
                  <div className="text-sm text-left ">
                    {Number(transaction.Amount) -
                      Number(transaction.Settlement.SettlementAmount) >
                    0 ? (
                      <>Balance Payment</>
                    ) : (
                      <>Balance Refund</>
                    )}
                    : QAR{" "}
                    <span className="font-semibold text-md">
                      {Number(transaction.Amount) -
                        Number(transaction.Settlement.SettlementAmount)}
                    </span>
                  </div>
                </>
              ) : null}
            </div>
            <div className="inline-flex ">
              <div className="my-auto text-right">
                <p className="text-sm font-semibold ">
                  {transaction.Employee.label
                    ? transaction.Employee.label
                    : transaction.Name}
                </p>
                <p className="text-xs ">{transaction.Employee.dept}</p>
              </div>
              <div className="avatar placeholder">
                <div className="w-8 my-auto ml-2 rounded-full bg-neutral-focus text-neutral-content">
                  <span className="text-xs">
                    {transaction.Employee.label
                      ? transaction.Employee.label
                          .split(" ")
                          .map((n) => n[0])
                          .join(".")
                      : transaction.Name.split(" ")
                          .map((n) => n[0])
                          .join(".")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showPrintBtn && isSelected ? (
        <>
          <Button
            layout="primary"
            className="w-full mt-2 transition-all"
            onClick={onClickPrint}
          >
            Print RV
          </Button>

          <ConfirmationModal
            isOpen={confirmationModalVisible}
            onClose={() => setConfirmationModalVisible(false)}
            handlePrint={handlePrint}
            setLoading={() => setPrintingLoading(true)}
            setSelectedRadio={setSelectedRadio}
          />
          <div className="hidden">
            <div className="block" ref={componentRef}>
              <ReceiptVoucher
                transaction={transaction}
                isSettlement={false}
                selectedRadio={selectedRadio}
              />
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}

TransactionCard.defaultProps = {
  showDate: true,
};
export default TransactionCard;
