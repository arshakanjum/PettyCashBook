import React, { useState, useEffect } from "react";

import PageTitle from "../components/Typography/PageTitle";
import SectionTitle from "../components/Typography/SectionTitle";
import CTA from "../components/CTA";
import {
  Table,
  TableHeader,
  TableCell,
  TableBody,
  TableRow,
  TableFooter,
  TableContainer,
  Badge,
  Label,
  Button,
  Select,
  Card,
  CardBody,
  Input,
  Modal,
} from "@windmill/react-ui";
import RoundIcon from "../components/RoundIcon";
import { OutlinePersonIcon, AddIcon, AddPersonIcon } from "../icons";
import {
  useFirebaseApp,
  useFirestoreCollectionData,
  useFirestoreDocData,
} from "reactfire";
import {
  getDocs,
  querySnapshot,
  getFirestore,
  where,
  query,
  collection,
  addDoc,
  serverTimestamp,
  orderBy,
  doc,
  updateDoc,
} from "firebase/firestore";
import AddEmployeeCard from "../components/Cards/AddEmployeeCard";
import { textIndexToArray } from "../firebase";
import ExpenseDetailModal from "../components/Cards/ExpenseDetailModal";
import UserDetailsView from "../components/Cards/UserDetailsView";
import { GrFormAdd } from "react-icons/gr";

function DepartmentFilterHeader(props) {
  var deptName;
  const db = getFirestore(useFirebaseApp());
  const addDept = () => {
    var configRef = doc(db, "Department", "data");
    var config = {};
    props.deptList.push(deptName);
    config.Departments = props.deptList;
    updateDoc(configRef, config);
    setIsAddMode(false);
  };
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27) {
        setIsAddMode(false);
      }
    };
    window.addEventListener("keydown", handleEsc);

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, []);

  const [isAddMode, setIsAddMode] = useState(false);
  return (
    <div className="flex justify-center mb-4 align-middle md:justify-start">
      <div
        className={
          props.selectedDept == "All"
            ? "mr-2 btn btn-primary btn-sm"
            : "mr-2 btn btn-outline btn-sm"
        }
        onClick={() => {
          props.setSelectedDept("All");
        }}
      >
        All
      </div>
      {props.deptList.map((deptName, i) => (
        <div
          className={
            props.selectedDept == deptName
              ? "mr-2 btn btn-neutral btn-sm"
              : "mr-2 btn btn-outline btn-sm"
          }
          onClick={() => {
            props.setSelectedDept(deptName);
          }}
        >
          {deptName}
        </div>
      ))}
      {!isAddMode ? (
        <button
          class="btn btn-square btn-sm btn-outline"
          onClick={() => setIsAddMode(true)}
        >
          <GrFormAdd />
        </button>
      ) : (
        <div className="flex w-1/3 btn-group">
          <input
            type="text"
            placeholder="Enter Department Name"
            class="input input-sm input-bordered w-1/2 max-w-xs"
            onChange={(event) => (deptName = event.target.value)}
          />
          <div className="btn btn-primary btn-sm" onClick={addDept}>
            Save
          </div>
        </div>
      )}
    </div>
  );
}

// make a copy of the data, for the second table

function Employees() {
  const [selectedDept, setSelectedDept] = useState("All");
  var deptList;
  const db = getFirestore(useFirebaseApp());
  const deptRef = collection(db, "Department");
  var configRef = doc(deptRef, "data");
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const { status, data: config } = useFirestoreDocData(configRef);
  var q;
  if (selectedDept == "All") {
    q = query(deptRef, orderBy("Name"));
  } else {
    q = query(deptRef, where("Dept", "==", selectedDept), orderBy("Name"));
  }
  const { statusEmp, data: employees } = useFirestoreCollectionData(q, {
    q,
    idField: "id", // this field will be added to the object created from each document
  });

  const addEmployee = async (arg, isNewDept) => {
    arg.Date = serverTimestamp();
    arg.SearchIndex = textIndexToArray(arg.Name);
    if (isNewDept) {
      config.Departments.push(arg.Dept);
      updateDoc(configRef, config).then((val) => {
        addDoc(deptRef, arg);
      });
    } else {
      addDoc(deptRef, arg);
    }
  };

  const onEmployeeClick = (user) => {
    setUser(user);
    setIsDetailsOpen(true);
  };

  if (status == "loading") {
    return null;
  } else {
    deptList = config.Departments;
    return (
      <div className="w-full p-8">
        <PageTitle className="text-primary">Employees</PageTitle>
        <DepartmentFilterHeader
          selectedDept={selectedDept}
          setSelectedDept={setSelectedDept}
          deptList={deptList}
        ></DepartmentFilterHeader>
        {!employees ? null : (
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-4">
            {employees.map((user, i) => (
              <div
                onClick={(e) => onEmployeeClick(user)}
                className="shadow-md h-28 card bg-neutral text-neutral-content hover:bg-neutral-focus hover:shadow-lg"
              >
                <div className="flex flex-row items-center card-body">
                  <RoundIcon
                    icon={OutlinePersonIcon}
                    iconColorClass="text-neutral"
                    bgColorClass="bg-neutral-content "
                    className="mr-4"
                  />
                  <div>
                    <p className="font-semibold text-neutral-content text-md ">
                      {user.Name}
                    </p>
                    <p className="text-sm text-neutral-content ">
                      {user.EmpId}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            <AddEmployeeCard
              deptList={deptList}
              addEmployee={addEmployee}
              filterSelected={selectedDept}
            />
          </div>
        )}
      </div>
    );
  }
}
// return (

// <>

export default Employees;
