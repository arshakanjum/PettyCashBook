import React from "react";
import { Card, CardBody, Avatar, Button } from "@windmill/react-ui";
import classNames from "classnames";
import moment from "moment";

function ExpenseDetailHeader({ transaction }) {
  return (
    <Card className=" shadow-xl border-b-2 border-primary ">
      <CardBody>
        <div className="flex flex-row justify-between text-sm ">
          <div className="flex flex-row align-middle items-center">
            <div></div>
          </div>
          <div className="w-1/3 text-right">
            {transaction.isAdvance ? null : (
              <p className=" mb-2 font-medium text-gray-600 dark:text-gray-400">
                {transaction.Desc}
              </p>
            )}
            <span>{transaction.IsAdvance ? "Advance" : "Expense"}</span>:{" "}
            <span className="text-lg text-right font-medium">
              QAR {transaction.Amount}
            </span>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

export default ExpenseDetailHeader;
