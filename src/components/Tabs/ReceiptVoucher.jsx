import React, { useContext, useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import VBTLogo from "../../assets/img/VBTLogo.png";
import { IoMdAddCircleOutline, IoIosRemoveCircleOutline } from "react-icons/io";
import { getNewInvoiceNumber, setNewInvoiceNumber } from "../../firebase";
import { useReactToPrint } from "react-to-print";
import { InvoiceContext } from "../../context/InvoiceContext";
import AdvancedCreatable from "../Elements/AdvancedCreatable";
import { AddCustomerCard } from "../../pages/CustomersList";
import PageTitle from "../Typography/PageTitle";
import { useFirebaseApp } from "reactfire";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getFirestore,
  serverTimestamp,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import Barcode from "react-barcode";

function Header(props) {
  return (
    <div className="flex flex-col pt-36 h-fit">
      <div className="flex flex-row justify-between -m-2 align-top h-fit">
        <Barcode
          width={0.9}
          height={40}
          fontSize={10}
          value={props.transaction.RVNumber}
          background={"#00000000"}
          displayValue={false}
        />
        <h1 className="mx-8 -my-8 text-3xl font-light text-gray-700 dark:text-gray-200 ">
          RECEIPT VOUCHER
        </h1>
      </div>

      <div className="flex items-start justify-between w-full h-full mt-2 ">
        <div>
          <div className="">
            <div className="inline-flex text-lg font-semibold ">
              <div className="w-56 text-xl"> {props.transaction.RVNumber}</div>
            </div>
            <br />
            <span>Date</span>:{" "}
            <span className="text-lg font-semibold ">
              {" "}
              {moment(props.transaction.Date.toDate()).format("DD/MM/YYYY")}
            </span>
            <br />
          </div>
        </div>
        <div className="flex flex-col items-end text-right">
          <img className="w-32 " src={VBTLogo} />
          <b>Virtual Bridge for Technology</b>
          P O Box: 2140
          <br />
          Doha, Qatar
          <br />
          hello@vbt.com
        </div>
      </div>
    </div>
  );
}

function Footer(props) {
  return (
    <div className="p-8 pt-4 -mx-24 h-1/4 bg-base-200 ">
      <div className="mt-8 text-2xl text-center bg-base-200">
        <span>Thank you!</span>
      </div>
      <div className="px-3 mt-8 text-sm text-center bg-base-200">
        hello@vbt.com ∖ www.vbt.com
      </div>
      <div className="text-sm text-center ">
        P.O. Box 2140, Doha, Tel.: (+974) 4482 0253 - Fax (+974) 4412 7341
      </div>
      <div className="text-sm text-center ">
        Email: info@virtualbridge-qatar.com ; operation@virtualbridge-qatar.com
      </div>
    </div>
  );
}

function ReceiptVoucher(props) {
  const scaledContent = useRef();

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    onAfterPrint: () => props.onPrint(),
  });

  return (
    props.transaction && (
      <>
        <div
          ref={componentRef}
          className="w-[210mm] h-[297mm] mx-auto box-border p-2 pb-0 bg-white shadow-lg text-base-content overflow-clip"
        >
          <div className="flex flex-col justify-start h-full p-20 py-0 border-2">
            <Header
              transaction={props.transaction}
              disableEditing={props.disableEditing}
            />

            <div className="px-3 mb-8 border border-t-2 border-gray-200"></div>

            <div className="flex flex-col justify-between flex-grow mb-24">
              <div>
                <p>
                  Cash received by{" "}
                  <b>
                    <u> {props.transaction.Name} </u>
                  </b>{" "}
                  for
                  {props.isSettlement ? (
                    <b>
                      <u>
                        {" "}
                        Settlement of{" "}
                        {props.transaction.AdvancesDetails.map(
                          (t, i) => t.RVNumber + ", "
                        )}
                      </u>
                    </b>
                  ) : props.transaction.IsAdvance ? (
                    <b>
                      <u> Advance - Petty Cash </u>
                    </b>
                  ) : (
                    <b>
                      <u> {props.transaction.Desc} </u>
                    </b>
                  )}
                </p>
              </div>
              <div className="flex flex-row justify-between mt-20">
                <div className="w-1/3 text-sm font-semibold leading-loose text-left ">
                  <div className="block">Amount Receive in</div>
                  <small className="flex flex-col justify-start text-xs">
                    <label className="justify-start p-0 cursor-pointer label">
                      <input
                        type="checkbox"
                        className="mr-2 checkbox checkbox-xs"
                      />
                      <span className="label-text">Cash</span>
                    </label>
                    <label className="justify-start p-0 cursor-pointer label">
                      <input
                        type="checkbox"
                        className="mr-2 checkbox checkbox-xs"
                      />
                      <span className="label-text">Cheque</span>
                    </label>
                    <label className="justify-start p-0 cursor-pointer label">
                      <input
                        type="checkbox"
                        className="mr-2 checkbox checkbox-xs"
                      />
                      <span className="label-text">Other</span>
                    </label>
                  </small>
                </div>
                <div className="grid self-end w-1/2 grid-cols-2">
                  <div className="col-span-2 border border-t-2 border-gray-200 "></div>
                  <span className="text-md">Amount: </span>
                  <span className="text-lg font-semibold justify-self-end">
                    QAR {props.transaction.Amount}
                  </span>
                  {props.isSettlement && (
                    <>
                      <span className="text-md">Settlement: </span>
                      <span className="text-lg justify-self-end">
                        QAR {props.transaction.SettlementAmount}
                      </span>
                      <span className="text-md">Balance: </span>
                      <span className="text-lg justify-self-end">
                        QAR{" "}
                        {props.transaction.Amount -
                          props.transaction.SettlementAmount}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
            <Footer />
          </div>
        </div>
      </>
    )
  );
}

ReceiptVoucher.defaultProps = {
  disableEditing: false,
  onPrint: () => {},
};

export default ReceiptVoucher;
