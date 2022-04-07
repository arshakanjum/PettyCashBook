import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  Label,
  Input,
  Select,
  Button,
} from "@windmill/react-ui";
import RoundIcon from "../../components/RoundIcon";
import { AddPersonIcon } from "../../icons";
import CreatableSelect, { useCreatable } from "react-select/creatable";
import StateManager from "react-select";
import { AiOutlineClose } from "react-icons/ai";
import ExpenseDetailModal from "./ExpenseDetailModal";

function AddEmployeeCard({ deptList, addEmployee, selectedDept }) {
  var email, empId, name, dept;
  var isNewDept = false;
  var handleDeptChange = (newValue, actionMeta) => {
    isNewDept = newValue.__isNew__;
    dept = newValue.value;
  };
  var handleDeptInputChange = (inputValue, actionMeta) => {
    console.group("Input Changed");
    console.log(inputValue);
    console.log(`action: ${actionMeta.action}`);
    console.groupEnd();
  };
  var deptSelectData = [];
  deptList.map((e, i) => {
    deptSelectData[i] = { value: e, label: e };
  });
  var test = deptSelectData.filter((i) => i.value == selectedDept)[0];
  const [showAddCard, setShowAddCard] = useState(false);
  if (!showAddCard) {
    return (
      <div className="flex justify-start w-full ">
        <Button
          className="mr-2 text-primary rounded-lg w-full"
          layout="outline"
          onClick={() => {
            setShowAddCard(true);
          }}
        >
          <AddPersonIcon className=" w-5 h-5" />
        </Button>
        {/* <RoundIcon
          icon={AddPersonIcon}
          iconColorClass="text-purple-800 dark:text-purple-100"
          bgColorClass="bg-purple-100 hover:bg-primary dark:bg-primary"
        /> */}
      </div>
    );
  } else {
    return (
      <Card className="shadow-lg">
        <CardBody>
          <div
            className="h-6 justify-end relative left-2 top-2  text-purple-400 hover:text-purple-700 hover:h-8"
            onClick={() => setShowAddCard(false)}
          >
            <AiOutlineClose />
          </div>
          <RoundIcon
            className="w-12 m-auto p-auto"
            icon={AddPersonIcon}
            iconColorClass="text-purple-800 dark:text-purple-100"
            bgColorClass="bg-purple-200 dark:bg-primary"
          />
          <div className="text-primary rounded-lg w-full">
            <Label>
              <span>Employee ID</span>
              <Input
                className=" rounded-lg border-1 ease-linear transition-all duration-150 w-full"
                placeholder="ID"
                onChange={(event) => {
                  empId = event.target.value;
                }}
              />
            </Label>
            <Label className="  mt-2">
              <span>Name</span>
              <Input
                className=" rounded-lg border-1 ease-linear transition-all duration-150 "
                placeholder="Name"
                onChange={(event) => {
                  name = event.target.value;
                }}
              />
            </Label>
            <Label className="mt-2 ">
              <span>Department</span>
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
                onChange={handleDeptChange}
                onInputChange={handleDeptInputChange}
                options={deptSelectData}
              />
            </Label>
            <Label className="mt-2 ">
              <span>Email</span>
              <Input
                className=" rounded-lg border-1 ease-linear transition-all duration-150  "
                placeholder="Email"
                onChange={(event) => {
                  email = event.target.value;
                }}
              />
            </Label>
            <Button
              className="mt-4 w-full h-full "
              onClick={() => {
                addEmployee(
                  {
                    Name: name,
                    Email: email,
                    Dept: dept,
                    EmpId: empId,
                  },
                  isNewDept
                );
                setShowAddCard(false);
              }}
            >
              <span aria-hidden="true">Save</span>
            </Button>
          </div>
        </CardBody>
      </Card>
    );
  }
}

export default AddEmployeeCard;
