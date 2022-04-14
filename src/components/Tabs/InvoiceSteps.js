import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useStepper } from "headless-stepper";
import GridListWithSearch from "../Elements/GridListWithSearch";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { useFirebaseApp } from "reactfire";
import Loader from "../Elements/Loader";
import { mockCustomers } from "../../mockData";
import { mockProducts } from "../../mockData";
import PageTitle from "../Typography/PageTitle";
import { InvoiceContext, InvoiceProvider } from "../../context/InvoiceContext";

function SelectCustomer() {
  const { state, setState } = useContext(InvoiceContext);
  const db = getFirestore(useFirebaseApp());
  const custRef = collection(db, "Customers");
  const [selected, setSelected] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [customers, setCustomers] = useState([]);
  useEffect(() => {
    const fetchCustomers = async () => {
      setCustomers(mockCustomers);
      setIsLoading(false);
      return;
      const snapshot = await getDocs(custRef);
      snapshot.forEach((doc) => {
        const data = doc.data();
        data.id = doc.id;
        setCustomers((prev) => [...prev, data]);
      });
      setIsLoading(false);
    };
    fetchCustomers();
  }, []);
  if (isLoading) {
    return <Loader />;
  }
  return (
    state && (
      <>
        <GridListWithSearch
          items={customers}
          setSelected={(selected) => setState({ ...state, Customer: selected })}
          searchField={"Name"}
          storeLocalStateOfSelected={true}
        >
          {(item, setSelected) => {
            return (
              <div
                className={`flex border-2 card card-compact hover:text-neutral-content hover:bg-neutral-focus hover:shadow-lg +
                  ${
                    selected === item
                      ? "bg-neutral text-neutral-content"
                      : "bg-transparent text-neutral"
                  }`}
                onClick={setSelected(item)}
              >
                <div className="flex flex-row items-center justify-center card-body">
                  <div>
                    <p className="text-sm font-semibold ">{item.Name}</p>
                    <p className="text-sm ">{item.Address}</p>
                  </div>
                </div>
              </div>
            );
          }}
        </GridListWithSearch>
      </>
    )
  );
}
function SelectProducts() {
  const db = getFirestore(useFirebaseApp());
  const custRef = collection(db, "Products");
  const [billProducts, setBillProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [Products, setProducts] = useState([]);
  useEffect(() => {
    const fetchProducts = async () => {
      setProducts(mockProducts);
      setIsLoading(false);
      return;
      const snapshot = await getDocs(custRef);
      snapshot.forEach((doc) => {
        const data = doc.data();
        data.id = doc.id;
        setProducts((prev) => [...prev, data]);
      });
      setIsLoading(false);
    };
    fetchProducts();
  }, []);
  if (isLoading) {
    return <Loader />;
  }
  return (
    <>
      <GridListWithSearch
        items={Products}
        setSelected={(item) => {
          let flag = false;
          const newList = billProducts.map((x) => {
            if (x.id === item.id) {
              flag = true;
              return { ...x, Quantity: x.Quantity + 1 };
            } else {
              return x;
            }
          });
          if (!flag) newList.push({ ...item, Quantity: 1 });
          setBillProducts(newList);
        }}
        searchField={"Name"}
        storeLocalStateOfSelected={false}
      />
      <div className="h-full pt-8">
        <table className="table w-full mx-auto -px-4">
          <thead>
            <tr>
              <th></th>
              <th>DESCRIPTION</th>
              <th className="text-right ">RATE</th>
              <th className="text-right ">UNITS</th>
              <th className="text-right ">SUBTOTAL</th>
            </tr>
          </thead>
          <tbody>
            {billProducts &&
              billProducts.map((item, idx) => (
                <tr>
                  <th>{idx + 1}</th>
                  <td className=" text-base-content">{item.Name}</td>
                  <td className="text-right text-base-content">
                    QAR {Intl.NumberFormat("en-IN").format(item.Price)}
                  </td>
                  <td className="text-right text-base-content">
                    {item.Quantity}
                  </td>
                  <td className="font-semibold text-right text-primary">
                    QAR{" "}
                    {Intl.NumberFormat("en-IN").format(
                      item.Price * item.Quantity
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
function Discounts() {
  return (
    <div className="w-64 h-32 bg-accent card card-bordered">Discounts</div>
  );
}

function Finalise() {
  return <div className="w-64 h-32 bg-accent card card-bordered">Finalise</div>;
}

function InvoiceSteps(props) {
  return (
    <>
      <PageTitle>Customers</PageTitle>
      <SelectCustomer />
    </>
  );
}

InvoiceSteps.propTypes = {};

export default InvoiceSteps;
