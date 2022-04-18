import React, { useState, useEffect } from "react";

import PageTitle from "../components/Typography/PageTitle";
import {
  useFirebaseApp,
  useFirestoreCollectionData,
  useFirestoreDocData,
} from "reactfire";
import {
  getDocs,
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
import GridListWithSearch from "../components/Elements/GridListWithSearch";

export function AddCustomerCard(props) {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const db = getFirestore(useFirebaseApp());
  const custRef = collection(db, "Customers");
  const addCustomer = async (arg) => {
    arg.createdAt = serverTimestamp();
    arg.SearchIndex = textIndexToArray(arg.Name);
    var doc = await addDoc(custRef, arg);
    setName("");
    setAddress("");
    props.onSave(doc.id);
  };
  return (
    <>
      <div className="justify-end card-actions"></div>
      <div className="w-full text-primary">
        <div className="w-full max-w-xs gap-2 form-control">
          <label className="input-group input-group-vertical">
            <span className="label-text">Name</span>
            <input
              type="text"
              value={name}
              className="w-full max-w-xs input input-bordered"
              onChange={(evt) => setName(evt.target.value)}
            />
          </label>
          <label className="input-group input-group-vertical">
            <span className="label-text">Address</span>
            <input
              type="text"
              className="w-full max-w-xs input input-bordered"
              onChange={(evt) => setAddress(evt.target.value)}
            />
          </label>
        </div>
        <div className="justify-end mt-4 card-actions">
          <button
            className="btn btn-neutral btn-block"
            onClick={() => {
              addCustomer({
                Name: name,
                Address: address,
              });
            }}
          >
            Save
          </button>
        </div>
      </div>
    </>
  );
}

function CustomersList(props) {
  const db = getFirestore(useFirebaseApp());
  const custRef = collection(db, "Customers");
  var q = query(custRef, orderBy("Name"));
  const { status, data: Customers } = useFirestoreCollectionData(q, {
    q,
    idField: "id", // this field will be added to the object created from each document
  });

  if (status == "loading") {
    return null;
  } else {
    return (
      <div className="w-full p-8">
        {Customers && (
          <GridListWithSearch
          Title="Customers"
            items={Customers}
            create={true}
            searchField={"Name"}
            setSelected={props.setSelected}
            createCard={AddCustomerCard}
          >
            {(item, setSelected) => {
              return (
                <div className="flex w-1/3 p-2">
                  <div
                    className="flex w-full border-2 card card-compact hover:shadow-lg"
                    onClick={() => {
                      setSelected(item);
                    }}
                  >
                    <div className="card-body">
                      <div className="flex items-center justify-between w-full">
                        <p>
                          <span className="card-title">{item.Name}</span>
                          <span className="font-semibold">{item.Address}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            }}
          </GridListWithSearch>
          /* <AddEmployeeCard
              deptList={deptList}
              addEmployee={addEmployee}
              filterSelected={selectedDept}
            /> */
        )}
      </div>
    );
  }
}
// return (

// <>

export default CustomersList;
