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
      <Button
        className="mr-2"
        layout={props.selectedDept == "All" ? "primary" : "outline"}
        onClick={() => {
          props.setSelectedDept("All");
        }}
      >
        All
      </Button>
      {props.deptList.map((deptName, i) => (
        <Button
          className="mr-2"
          layout={props.selectedDept == deptName ? "primary" : "outline"}
          onClick={() => {
            props.setSelectedDept(deptName);
          }}
        >
          {deptName}
        </Button>
      ))}
      {!isAddMode ? (
        <Button
          icon={AddIcon}
          layout="link"
          aria-label="Add"
          onClick={() => setIsAddMode(true)}
        />
      ) : (
        <div className="flex w-1/3">
          <Input
            className="w-20 mr-4 bg-transparent rounded-lg"
            placeholder="Enter Department Name"
            onChange={(event) => (deptName = event.target.value)}
          />
          <Button className="mr-8" onClick={addDept}>
            Save
          </Button>
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
      <div>
        <Modal
          isOpen={isDetailsOpen}
          onClose={() => setIsDetailsOpen(false)}
          className="relative w-2/3 h-full"
        >
          {isDetailsOpen ? (
            <UserDetailsView
              Employee={user}
              isOpen={isDetailsOpen}
              onClose={setIsDetailsOpen}
            />
          ) : null}
        </Modal>

        <div className="flex flex-row justify-between align-middle ">
          <PageTitle className="text-purple-600">Employees</PageTitle>
          <div className="my-6">
            <Button className="mx-2">
              Add Employee
              <span className="ml-2" aria-hidden="true">
                +
              </span>
            </Button>
            {/* <Button layout="outline" className="mx-2 text-purple-600 ">
              Add Department
              <span className="ml-2" aria-hidden="true">
                +
              </span>
            </Button> */}
          </div>
        </div>
        <DepartmentFilterHeader
          selectedDept={selectedDept}
          setSelectedDept={setSelectedDept}
          deptList={deptList}
        ></DepartmentFilterHeader>
        {!employees ? null : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
            {employees.map((user, i) => (
              <Card
                onClick={(e) => onEmployeeClick(user)}
                className="h-24 m-2 shadow-sm hover:bg-purple-200 hover:shadow-lg"
              >
                <CardBody className="flex items-center">
                  <RoundIcon
                    icon={OutlinePersonIcon}
                    iconColorClass="text-primary dark:text-purple-100"
                    bgColorClass="bg-purple-100 dark:bg-primary"
                    className="mr-4"
                  />
                  <div>
                    <p className="font-semibold text-gray-700 text-md dark:text-gray-200 ">
                      {user.Name}
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-200 ">
                      {user.EmpId}
                    </p>
                  </div>
                </CardBody>
              </Card>
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
