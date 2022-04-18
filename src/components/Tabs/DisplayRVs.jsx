import {
  collection,
  doc,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useFirebaseApp } from "reactfire";
import ReceiptVoucher from "./ReceiptVoucher";

export function DisplayRVs(props) {
  const db = getFirestore(useFirebaseApp());
  const [selectedTransaction, setSelectedTransaction] = useState(
    props.selectedTransaction
  );
  const [settlement, setSettlement] = useState(null);

  return (
    <div className="right-0 flex flex-col">
      <div className="self-end p-4 pb-0 btn-group ">
        <button className="btn btn-active">Print RV</button>
        {props.selectedTransaction.IsSettled ? (
          <button className="btn">Print Settlement RV</button>
        ) : (
          <button className="btn" onClick={() => props.setIsSettleMode(true)}>
            Settle
          </button>
        )}
      </div>
      <div className="flex flex-row justify-around gap-4 p-4">
        <div className="flex flex-col w-full h-full origin-top scale-75">
          <ReceiptVoucher
            transaction={props.selectedTransaction}
            isSettlement={false}
          />
        </div>
        {props.selectedTransaction.IsAdvance ? (
          props.settlement ? (
            <div className="flex flex-col w-full h-full origin-top scale-75">
              <ReceiptVoucher
                transaction={props.settlement}
                isSettlement={true}
              />
            </div>
          ) : null
        ) : null}
      </div>
    </div>
  );
}
