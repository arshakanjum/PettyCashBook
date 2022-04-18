import { id } from "date-fns/locale";
import { collection, getFirestore, orderBy, query } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import CreatableSelect, { useCreatable } from "react-select/creatable";
import { useFirebaseApp, useFirestoreCollectionData } from "reactfire";
import Loader from "./Loader";
import { IoIosClose } from "react-icons/io";

const createOption = (c) => ({
  ...c,
  label: c.Name,
  value: c.id,
});

export default function AdvancedCreatable(props) {
  const db = getFirestore(useFirebaseApp());
  const custRef = collection(db, props.collectionName);
  var q = query(custRef, orderBy(props.orderBy));
  const { status, data: Customers } = useFirestoreCollectionData(q, {
    q,
    idField: "id", // this field will be added to the object created from each document
  });

  const [isLoading, setIsLoading] = useState(false);
  const [value, setValue] = useState();
  const [showAdd, setShowAdd] = useState(false);
  const [options, setOptions] = useState([]);
  const handleChange = (newValue, actionMeta) => {
    console.group("Value Changed");
    console.log(newValue);
    console.log(`action: ${actionMeta.action}`);
    console.groupEnd();
    setValue(newValue);
    props.setValue(newValue);
  };

  const handleCreate = (inputValue) => {
    setIsLoading(true);
    setShowAdd(true);
  };

  if (status == "loading") {
    return (
      <div className="flex w-56 h-8 ">
        <Loader width={220} />
      </div>
    );
  }
  if (options.length != Customers.length) {
    setOptions(Customers.map(createOption));
  }
  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      color: state.isSelected ? "red" : "blue",
    }),
    control: () => ({
      // none of react-select's styles are passed to <Control />
      width: "auto",
    }),
    singleValue: (provided, state) => {
      const opacity = state.isDisabled ? 0.5 : 1;
      const transition = "opacity 300ms";

      return { ...provided, opacity, transition };
    },
  };

  return (
    <>
      <CreatableSelect
        className={`-mr-3 pb-2 border-0 $props.className`}
        isClearable
        isDisabled={isLoading}
        isLoading={isLoading}
        onChange={handleChange}
        onCreateOption={handleCreate}
        options={options}
        value={value}
        placeholder={props.placeholder}
      />
      {showAdd && (
        <div className="p-2 m-2 shadow card text-primary-content bg-primary">
          <div class="card-actions justify-between mb-4 ">
            <span>Add Customer</span>
            <button
              onClick={() => {
                setShowAdd(false);
                setIsLoading(false);
              }}
            >
              <IoIosClose className="w-6 h-6" />
            </button>
          </div>
          <props.createCard
            onSave={(val) => {
              setShowAdd(false);
              setIsLoading(false);
            }}
          />
        </div>
      )}
    </>
  );
}

AdvancedCreatable.defaultProps = {
  placeholder: "Select an option",
};
