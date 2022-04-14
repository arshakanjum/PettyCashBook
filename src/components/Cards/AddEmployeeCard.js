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
      <div
        className=" h-28 card btn btn-outline btn-neutral"
        layout="outline"
        onClick={() => {
          setShowAddCard(true);
        }}
      >
        <AddPersonIcon className="w-5 h-5 " />
      </div>
    );
  } else {
    return (
      <div className="border-2 shadow-md w-96 bg-base-200-lg card">
        <div className="card-body">
          <div class="card-actions justify-end">
            <button
              class="btn btn-square btn-sm"
              onClick={() => setShowAddCard(false)}
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
          <div className="w-full   text-primary">
            <div class="form-control w-full max-w-xs">
              <label class="label">
                <span class="label-text">Employee ID</span>
              </label>
              <input
                type="text"
                placeholder="ID"
                class="input input-bordered w-full max-w-xs"
                onChange={(event) => {
                  empId = event.target.value;
                }}
              />
              <label class="label">
                <span class="label-text">Name</span>
              </label>
              <input
                type="text"
                placeholder="Name"
                class="input input-bordered w-full max-w-xs"
                onChange={(event) => {
                  name = event.target.value;
                }}
              />
              <label class="label">
                <span class="label-text">Department</span>
              </label>
              <CreatableSelect
                isClearable
                // theme={(theme) => ({
                //   ...theme,
                //   spacing: {
                //     baseUnit: 2,
                //     controlHeight: 38,
                //     menuGutter: 4,
                //   },
                //   borderColor: "#d8b4fe",
                //   borderRadius: 8,
                //   colors: {
                //     ...theme.colors,
                //     primary25: "#e9d5ff",
                //     primary: "#a855f7",
                //   },
                // })}
                onChange={handleDeptChange}
                onInputChange={handleDeptInputChange}
                options={deptSelectData}
              />
              <label class="label">
                <span class="label-text">Email</span>
              </label>
              <input
                type="text"
                placeholder="Email"
                class="input input-bordered w-full max-w-xs"
                onChange={(event) => {
                  email = event.target.value;
                }}
              />
            </div>
            <div class="card-actions mt-4 justify-end">
              <button
                class="btn"
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
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AddEmployeeCard;
