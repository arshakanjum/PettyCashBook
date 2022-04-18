import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useStepper } from "headless-stepper";
import GridListWithSearch from "../Elements/GridListWithSearch";
import {
  collection,
  doc,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import { useFirebaseApp, useFirestoreDocData } from "reactfire";
import Loader from "../Elements/Loader";
import { mockCustomers } from "../../mockData";
import { mockProducts } from "../../mockData";
import PageTitle from "../Typography/PageTitle";
import { InvoiceContext, InvoiceProvider } from "../../context/InvoiceContext";
import { faGamepad } from "@fortawesome/free-solid-svg-icons";

function InvoiceSteps(props) {
  const db = getFirestore(useFirebaseApp());
  const dataRef = doc(db, "Data", "CalculatedValues");
  const { status, data } = useFirestoreDocData(dataRef);
  if (status == "loading") {
    return <Loader />;
  }
  return (
    <div className="h-32 mx-auto shadow-md w-fit stats shadow-primary">
      <div className="stat place-items-center">
        <div className="stat-title">Total Receivable</div>
        <div className="stat-value text-primary">
          QAR {data.TotalReceivable}
        </div>
      </div>
    </div>
  );
}

InvoiceSteps.propTypes = {};

export default InvoiceSteps;
