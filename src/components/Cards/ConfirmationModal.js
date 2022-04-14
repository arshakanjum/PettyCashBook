import React, { useState, useEffect } from "react";
import { Modal, Label, Input, Button } from "@windmill/react-ui";

import "react-nice-dates/build/style.css";
import ExpenseDetailHeader from "./ExpenseDetailHeader";
import SettlementDetailsView from "./SettlementDetailsView";

function ConfirmationModal({
  isOpen,
  onClose,
  handlePrint,
  setSelectedRadio,
  selectedRadio,
  isSettlemnt,
}) {
  const [selected, setSelected] = useState(selectedRadio ? selectedRadio : "");
  const onChangeRadio = (e) => {
    setSelected(e.target.value);
    setSelectedRadio(e.target.value);
  };
  return (
    <Modal
      isOpen={isOpen}
      onClose={() => onClose(false)}
      className="w-1/3 h-full overflow-auto pt-96 scrollbar-thin scrollbar-thumb-purple-400 scrollbar-track-purple-100 scrollbar-thumb-rounded-full scrollbar-track-rounded-full"
    >
      <div className="flex flex-col justify-between p-4 align-middle border-2   shadow-2xl bg-base-100 border-primary">
        <div className="w-full">
          Confirm Cash Received by <u>Arshak Anjum</u> for{" "}
          <u>Advance-Petty Cash</u>
        </div>

        <div className="flex flex-row justify-between mt-2">
          <div className="p-2 text-left bg-gray-200  " onChange={onChangeRadio}>
            Amount Receive in
            <small className="flex flex-row justify-start gap-2 text-xs">
              <Label radio>
                <Input type="radio" value="Cash" checked={selected == "Cash"} />
                <span className="ml-1">Cash</span>
              </Label>
              <Label radio>
                <Input
                  type="radio"
                  value="Cheque"
                  checked={selected == "Cheque"}
                />
                <span className="ml-1">Cheque</span>
              </Label>
              <Label radio>
                <Input
                  type="radio"
                  value="Other"
                  checked={selected == "Other"}
                />
                <span className="ml-1">Other</span>
              </Label>
            </small>
          </div>
          <div className="w-1/3 p-2 text-sm text-gray-100 bg-primary   dark:text-gray-200 ">
            Amount
            <div className="font-semibold text-left text-md">QAR 200</div>
          </div>
        </div>
        <div className="flex flex-row mt-2">
          <Button layout="outline" className="w-1/2 mr-2 transition-all">
            Cancel
          </Button>
          {selected.length > 0 ? (
            <Button
              layout="primary"
              className="w-1/2 ml-2 transition-all"
              onClick={() => {
                handlePrint();
                onClose(true);
              }}
            >
              Confirm
            </Button>
          ) : (
            <Button
              disabled
              layout="primary"
              className="w-1/2 ml-2 transition-all"
            >
              Confirm
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
}

export default ConfirmationModal;
