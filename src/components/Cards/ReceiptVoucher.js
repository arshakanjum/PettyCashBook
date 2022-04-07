import React, { useRef, useState } from "react";
import PropTypes from "prop-types";
import { useReactToPrint } from "react-to-print";
import {
  CollectionReference,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import VBTLogo from "../../assets/img/VBTLogo.png";
import moment from "moment";
import { Label, Input, Backdrop } from "@windmill/react-ui";
import Barcode from "react-barcode";
import { BillsTable, SettlementsTable } from "./SettlementDetailsView";

function ReceiptVoucher(props) {
  const [selectedRadio, setSelectedRadio] = useState(
    props.selectedRadio || "Cash"
  );
  const onChangeRadio = (e) => {
    setSelectedRadio(e.target.innerText);
  };
  var transaction;
  if (!props.transaction) {
    return null;
  }
  transaction = props.transaction;
  return (
    <>
      <div className="gap-4 py-6 pl-4 pr-4">
        <div className="flex flex-row justify-between align-middle">
          <Barcode
            width={1}
            height={40}
            fontSize={10}
            value={transaction.RVNumber}
          />
          <div className="w-1/3 ">
            <img src={VBTLogo} />
          </div>
        </div>
        <div className="flex flex-row justify-between align-middle">
          <div>
            <span className="">Cash Receipt #</span>:{" "}
            <span className="font-bold text-md">{transaction.RVNumber}</span>
            <br />
            <span>Date</span>:{" "}
            <b>{moment(transaction.Date.toDate()).format("DD-MMMM-YYYY")}</b>
            <br />
          </div>
          <div className="text-right">
            <b>Virtual Bridge for Technology</b>
            <br />
            Doha, Qatar
            <br />
          </div>
        </div>
        <div className="border border-t-2 border-gray-200" />
        <div className="pt-8">
          <p>
            Cash received by{" "}
            <b>
              <u> {transaction.Name} </u>
            </b>{" "}
            for
            {props.isSettlement ? (
              <b>
                <u>
                  {" "}
                  Settlement of{" "}
                  {transaction.AdvancesDetails.map((t, i) => t.RVNumber + ", ")}
                </u>
              </b>
            ) : transaction.IsAdvance ? (
              <b>
                <u> Advance - Petty Cash </u>
              </b>
            ) : (
              <b>
                <u> {transaction.Desc} </u>
              </b>
            )}
          </p>
        </div>
        {props.isSettlement ? (
          <div>
            Settlement Bills received
            <BillsTable Bills={transaction.Bills} />
          </div>
        ) : null}
        <div className="flex flex-row justify-between gap-4 align-middle">
          <div className="w-1/3 text-sm font-semibold leading-loose text-left ">
            Amount Receive in
            <small className="flex flex-col text-xs">
              <Label radio>
                <Input
                  type="radio"
                  value="Cash"
                  checked={selectedRadio == "Cash"}
                />
                <span className="ml-2 font-normal">Cash</span>
              </Label>
              <Label radio>
                <Input
                  type="radio"
                  value="Cheque"
                  checked={selectedRadio == "Cheque"}
                />
                <span className="ml-2 font-normal">Cheque</span>
              </Label>
              <Label radio>
                <Input
                  type="radio"
                  value="Other"
                  checked={selectedRadio == "Other"}
                />
                <span className="ml-2 font-normal">Other</span>
              </Label>
            </small>
          </div>
          <div className="flex flex-col w-2/3 gap-2 my-auto">
            <div className="flex items-center ">
              <div className="flex justify-between w-full px-2 bg-gray-200 rounded-lg">
                <div className="inline-flex text-left">Amount</div>
                <div className="inline-flex font-medium text-right whitespace-nowrap">
                  QAR {transaction.Amount}
                </div>
              </div>
            </div>

            {props.isSettlement ? (
              <>
                <div className="flex items-center justify-end ">
                  <div className="flex justify-between w-full px-2 bg-gray-200 rounded-lg">
                    <div className="inline-flex text-left">Settlement</div>
                    <div className="inline-flex font-medium text-right whitespace-nowrap">
                      QAR {transaction.SettlementAmount}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-end ">
                  <div className="flex justify-between w-full px-2 bg-gray-200 rounded-lg">
                    <div className="inline-flex text-left">Balance</div>
                    <div className="inline-flex font-medium text-right whitespace-nowrap">
                      QAR{" "}
                      {props.isSettlement
                        ? transaction.Amount - transaction.SettlementAmount
                        : transaction.Amount}
                    </div>
                  </div>
                </div>
              </>
            ) : null}
          </div>
        </div>
        <div className="flex justify-start ">
          {transaction.IsAdvance ? (
            <div>
              <span>Bills to be settled on or before</span>{" "}
              <b>
                {moment(transaction.Date.toDate())
                  .add(7, "days")
                  .format("dddd, DD-MMMM-YYYY")}
              </b>{" "}
            </div>
          ) : null}
        </div>
        <div className="flex flex-col">
          <div className="p-4 text-right text-md">
            <span>____________________</span>
            <br />
            <span>Signed By</span>
          </div>
          <div className="text-sm text-center ">
            P.O. Box 2140, Doha, Tel.: (+974) 4482 0253 - Fax (+974) 4412 7341
          </div>
          <div className="text-sm text-center ">
            Email: info@virtualbridge-qatar.com ;
            operation@virtualbridge-qatar.com
          </div>
          <div className="text-sm text-center ">{moment().format("HH:mm")}</div>
          <div className="text-sm text-center ">
            {moment().format("DD-MMMM-YY")}
          </div>
        </div>
      </div>
    </>
  );
}

ReceiptVoucher.propTypes = {};

export default ReceiptVoucher;
