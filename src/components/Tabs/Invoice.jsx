import React, { useContext, useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import VBTLogo from "../../assets/img/VBTLogo.png";
import { IoMdAddCircleOutline, IoIosRemoveCircleOutline } from "react-icons/io";
import { getNewInvoiceNumber, setNewInvoiceNumber } from "../../firebase";
import { useReactToPrint } from "react-to-print";
import { InvoiceContext } from "../../context/InvoiceContext";
import AdvancedCreatable from "../Elements/AdvancedCreatable";
import { AddCustomerCard } from "../../pages/CustomersList";
import PageTitle from "../Typography/PageTitle";
import { useFirebaseApp } from "reactfire";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getFirestore,
  serverTimestamp,
  Timestamp,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import Barcode from "react-barcode";
import { Calendar } from "react-multi-date-picker";

function InvoiceHeader(props) {
  return (
    <div className="flex flex-col pt-20 h-fit">
      <div className="flex flex-row justify-between -m-2 align-top h-fit">
        <Barcode
          width={0.9}
          height={40}
          fontSize={10}
          value={props.state.InvoiceNumber}
          background={"#00000000"}
          displayValue={false}
        />
        <h1 className="mx-8 -my-8 text-3xl font-light text-gray-700 dark:text-gray-200 ">
          INVOICE
        </h1>
      </div>

      <div className="flex items-center justify-between w-full h-full">
        <div>
          <div className="">
            <div className="inline-flex items-center text-lg font-semibold ">
              {props.state.isEditable && (
                <input
                  name="InvoiceNo"
                  type="text"
                  disabled={props.disableEditing}
                  value={props.state.InvoiceNumber}
                  className="w-56 p-0 text-xl tracking-widest input input-ghost input-sm"
                  onChange={props.handleChange}
                />
              )}
              {!props.state.isEditable && (
                <div className="w-56 text-xl"> {props.state.InvoiceNumber}</div>
              )}
            </div>
            <br />
            <span>Date</span>:{" "}
            {props.state.isEditable ? (
              <div class="dropdown">
                <input
                  name="Date"
                  type="text"
                  disabled={props.disableEditing}
                  value={moment(props.state.Date).format("DD/MM/YYYY")}
                  className="w-56 p-0 text-lg font-semibold input input-ghost input-sm"
                  onChange={props.handleChange}
                />
                <ul tabindex="0" class="dropdown-content menu">
                  <li>
                    <Calendar
                      onChange={(item) => {
                        props.handleChange({
                          target: { name: "Date", val: item.toDate() },
                        });
                      }}
                    />
                  </li>
                </ul>
              </div>
            ) : (
              <span className="text-lg font-semibold ">
                {" "}
                {moment(props.state.Date).format("DD/MM/YYYY")}
              </span>
            )}
            <br />
          </div>
          <br />
          Bill To
          <br />
          <b>
            {
              <>
                {props.state.isEditable ? (
                  <div className="print:hidden">
                    <AdvancedCreatable
                      collectionName="Customers"
                      orderBy="Name"
                      placeholder="Select Customer"
                      createCard={AddCustomerCard}
                      setValue={(value) => {
                        if (props.state.Items.length == 0) {
                          props.setState({
                            ...props.state,
                            Customer: value,
                            Items: [...props.state.Items, {}],
                          });
                        }
                      }}
                    />
                  </div>
                ) : (
                  props.state.Customer && (
                    <div className="text-lg font-semibold ">
                      {" "}
                      {props.state.Customer.Name}
                    </div>
                  )
                )}
              </>
            }
          </b>
          {props.state.isEditable ? (
            <input
              name="CustomerAddress"
              type="text"
              disabled={true}
              placeholder="Customer Address"
              value={props.state.Customer.Address ?? ""}
              className="w-56 p-0 text-lg font-semibold input input-ghost input-sm"
              onChange={props.handleChange}
            />
          ) : (
            props.state.Customer && (
              <span className="text-lg font-semibold ">
                {" "}
                {props.state.Customer.Address}
              </span>
            )
          )}
        </div>
        <div className="flex flex-col items-end text-right">
          <img className="w-32 " src={VBTLogo} />
          <b>Virtual Bridge for Technology</b>
          P O Box: 2140
          <br />
          Doha, Qatar
          <br />
          hello@vbt.com
        </div>
      </div>
    </div>
  );
}

function Footer(props) {
  return (
    <div className="p-8 pt-4 -mx-24 h-1/4 bg-base-200">
      <div className="flex-row px-4 mx-8 justify-self-end">
        <div className="w-full font-bold text-right">TOTAL DUE</div>
      </div>
      <div className="mx-4 border border-t-2 neutral "></div>
      <div className="flex flex-row items-center h-16 px-4 text-right align-middle justify-evenly bg-base-200">
        <div className="w-full mx-8 text-2xl font-bold text-primary">
          QAR{" " + props.Amount}
        </div>
      </div>
      <div className="mx-4 border border-t-2 neutral "></div>
      <div className="mt-8 text-2xl text-center bg-base-200">
        <span>Thank you!</span>
      </div>
      <div className="mt-4 text-sm text-center ">
        P.O. Box 2140, Doha, Tel.: (+974) 4482 0253 - Fax (+974) 4412 7341
      </div>
      <div className="text-sm text-center ">
        Email: info@virtualbridge-qatar.com ; operation@virtualbridge-qatar.com
      </div>
    </div>
  );
}

function Invoice({ onPrint, disableEditing, onCancel }) {
  const scaledContent = useRef();

  const db = getFirestore(useFirebaseApp());
  const invoiceRef = collection(db, "Invoices");
  const custRef = collection(db, "Customers");
  const dataRef = doc(db, "Data", "CalculatedValues");
  var id;
  const { invoiceState: state, setInvoiceState: setState } =
    useContext(InvoiceContext);
  useEffect(() => {
    if (!state.InvoiceNumber) {
      getNewInvoiceNumber().then((res) => {
        setState({
          ...state,
          InvoiceNumber: res,
        });
      });
    }
  }, [state]);

  useEffect(() => {
    if (state.Items)
      var tot =
        state.Items.reduce((a, b) => {
          if (b.Rate) {
            return Number(a) + Number(b.Rate * b.Units);
          } else {
            return Number(a);
          }
        }, 0) -
        state.Discount +
        state.OtherCharges;
    setState({ ...state, Amount: tot });
  }, [state.Items, state.Discount, state.OtherCharges]);
  const handleChange = (event) => {
    var field = event.target.name;
    setState({ ...state, [field]: event.target.val });
  };
  const createInvoice = async (e) => {
    const batch = writeBatch(db);
    const { isItemsEditable, isEditable, ...invJson } = {
      ...state,
      IsPaid: false,
      Date: Timestamp.fromDate(state.Date),
      createdAt: serverTimestamp(),
      Items: state.Items.filter((item) => Number(item.Units) > 0),
    };
    var ref = doc(invoiceRef);
    const dataDoc = await getDoc(dataRef);
    batch.update(dataRef, {
      TotalReceivable:
        Number(dataDoc.data().TotalReceivable) + Number(invJson.Amount),
    });
    batch.update(doc(custRef, invJson.Customer.id), {
      TotalReceivable:
        Number(invJson.Customer.TotalReceivable) + Number(invJson.Amount),
    });
    batch.set(ref, invJson);
    var batchDoc = await batch.commit();
    setNewInvoiceNumber(invJson.InvoiceNumber);

    setState({
      ...invJson,
      id: ref.id,
      isEditable: false,
      isItemsEditable: false,
    });
    id = ref.id;
  };

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    onAfterPrint: () => onPrint(id),
  });
  const handleNew = () => {
    setState({
      Customer: { Name: "", Address: "" },
      Items: [],
      Discount: 0,
      OtherCharges: 0,
      isEditable: true,
    });
  };

  return (
    state && (
      <>
        {!state.isEditable && (
          <div className="flex justify-end w-[8.5in] mx-auto my-2">
            <button
              className="self-end btn btn-primary"
              onClick={async () => {
                await createInvoice();
                handlePrint();
              }}
            >
              Print
            </button>
          </div>
        )}
        <div
          ref={componentRef}
          className="w-[210mm] h-[297mm] mx-auto box-border p-2 bg-white shadow-lg text-base-content overflow-clip"
        >
          <div className="flex flex-col justify-start h-full p-20 py-0 border-2">
            <InvoiceHeader
              disableEditing={disableEditing}
              state={state}
              setState={setState}
              isEditable={state.isEditable}
              handleChange={handleChange}
            />

            <div className="px-3 mb-8 border border-t-2 border-gray-200"></div>

            <div className="flex flex-col justify-between flex-grow ">
              <div>
                <table className="table w-full border-2 table-auto ">
                  <thead>
                    <tr>
                      <td className="z-auto"></td>
                      <td>DESCRIPTION</td>
                      <td className="text-right">RATE</td>
                      <td className="text-right">UNITS</td>
                      <td className="text-right">SUBTOTAL</td>
                      <td></td>
                    </tr>
                  </thead>
                  <tbody>
                    {state.Items &&
                      state.Items.map((item, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>
                            {state.isEditable || state.isItemsEditable ? (
                              <input
                                name="Description"
                                disabled={
                                  !state.isEditable && !state.isItemsEditable
                                }
                                type="text"
                                value={item.Description}
                                className="w-64 -mr-3 input input-bordered input-primary input-sm text-md h-fit "
                                onChange={(event) => {
                                  var field = event.target.name;
                                  setState({
                                    ...state,
                                    Items: Object.assign([], state.Items, {
                                      [index]: {
                                        ...item,
                                        [field]: event.target.value,
                                      },
                                    }),
                                  });
                                }}
                              />
                            ) : (
                              <div className="flex">
                                <div className="flex w-64 text-sm break-words whitespace-normal">
                                  {item.Description}
                                </div>
                              </div>
                            )}
                          </td>
                          <td className="text-right">
                            {
                              <input
                                name="Rate"
                                disabled={
                                  !state.isEditable && !state.isItemsEditable
                                }
                                type="number"
                                value={item.Rate}
                                className="w-16 -mr-3 input input-bordered input-primary input-sm text-md"
                                onChange={(event) => {
                                  var field = event.target.name;
                                  setState({
                                    ...state,
                                    Items: Object.assign([], state.Items, {
                                      [index]: {
                                        ...item,
                                        [field]: event.target.value,
                                      },
                                    }),
                                  });
                                }}
                              />
                            }
                          </td>
                          <td className="text-right">
                            {
                              <input
                                name="Units"
                                disabled={
                                  !state.isEditable && !state.isItemsEditable
                                }
                                type="number"
                                value={item.Units}
                                className="w-12 -mr-3 input input-bordered input-primary input-sm text-md"
                                onChange={(event) => {
                                  var field = event.target.name;
                                  setState({
                                    ...state,
                                    Items: Object.assign([], state.Items, {
                                      [index]: {
                                        ...item,
                                        [field]: event.target.value,
                                      },
                                    }),
                                  });
                                }}
                                onKeyUp={(event) => {
                                  if (state.Items.length == index + 1) {
                                    setState({
                                      ...state,
                                      Items: [...state.Items, {}],
                                    });
                                  }
                                }}
                              />
                            }
                          </td>
                          <td className="text-right">
                            {item.Rate ? Number(item.Rate * item.Units) : 0}
                          </td>
                          <td
                            className="print:hidden hover:text-red-500"
                            onClick={() => {
                              setState({
                                ...state,
                                Items: state.Items.filter(
                                  (_, i) => i !== index
                                ),
                              });
                            }}
                          >
                            {state.isEditable && <IoIosRemoveCircleOutline />}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
                {state.isEditable && (
                  <div
                    className="flex h-16 mx-auto my-2 cursor-pointer w-fit print:hidden "
                    onClick={() =>
                      setState({ ...state, Items: [...state.Items, {}] })
                    }
                  >
                    <IoMdAddCircleOutline
                      className="mr-1 text-gray-600 hover:text-gray-800"
                      size={30}
                    />
                    Add Item Row
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 ">
                <div className="col-span-2 border border-t-2 border-gray-200 "></div>
                <span className="text-md">Sub Total: </span>
                <span className="text-lg font-semibold justify-self-end">
                  QAR{" "}
                  {state.Items &&
                    state.Items.reduce((a, b) => {
                      {
                        if (!b.Rate) {
                          return Number(a);
                        }
                        return Number(a) + Number(b.Rate * b.Units);
                      }
                    }, 0)}
                </span>
                <span className="text-md">Discount: </span>
                {state.isEditable ? (
                  <div className="justify-self-end">
                    <span className="mr-2">QAR</span>
                    <input
                      name="Discount"
                      type="number"
                      prefix="QAR "
                      placeholder="Discount"
                      value={state.Discount}
                      className="w-24 -mr-3 text-lg font-semibold text-right input input-sm input-bordered input-primary justify-self-end"
                      onChange={handleChange}
                    />
                  </div>
                ) : (
                  <span className="text-lg justify-self-end">
                    QAR {state.Discount}
                  </span>
                )}
                <span className="text-md">Other Charges: </span>
                {state.isEditable ? (
                  <div className="justify-self-end">
                    <span className="mr-2">QAR</span>
                    <input
                      name="OtherCharges"
                      type="text"
                      prefix="QAR "
                      placeholder="OtherCharges"
                      value={state.OtherCharges}
                      className="w-24 -mr-3 text-lg font-semibold text-right input input-sm input-bordered input-primary justify-self-end"
                      onChange={handleChange}
                    />
                  </div>
                ) : (
                  <span className="text-lg justify-self-end">
                    QAR {state.OtherCharges}
                  </span>
                )}
              </div>
            </div>
            <Footer Amount={state.Amount}></Footer>
          </div>
        </div>
        <div className="flex justify-end w-[8.5in] mx-auto mt-4">
          {state.isEditable && (
            <>
              <button
                className="self-end mr-2 btn btn-outline "
                onClick={onCancel}
              >
                Cancel
              </button>
              <button
                className="self-end btn btn-primary"
                onClick={createInvoice}
              >
                Save Invoice
              </button>
            </>
          )}
        </div>
      </>
    )
  );
}

Invoice.defaultProps = {
  disableEditing: false,
  onPrint: () => {},
};

export default Invoice;
