import React, { useContext, useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import VBTLogo from "../../assets/img/VBTLogo.png";
import { IoMdAddCircleOutline, IoIosRemoveCircleOutline } from "react-icons/io";
import { getNewInvoiceNumber } from "../../firebase";
import { useReactToPrint } from "react-to-print";
import { InvoiceContext } from "../../context/InvoiceContext";
function Invoice({ onPrint }) {
  const { invoiceState: state, setInvoiceState: setState } =
    useContext(InvoiceContext);
  useEffect(() => {
    getNewInvoiceNumber().then((res) => {
      setState({
        ...state,
        InvoiceNumber: res,
      });
    });
  }, []);

  const handleChange = (event) => {
    var field = event.target.name;
    setState({ ...state, [field]: event.target.value });
  };
  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    onAfterPrint: () => onPrint(),
  });
  return (
    state && (
      <div className="flex flex-col">
        <button className="self-end btn" onClick={handlePrint}>
          Print
        </button>
        <div
          ref={componentRef}
          className=" box-border w-[8.5in] h-[12in] bg-white shadow-lg text-base-content overflow-clip p-2"
        >
          <div className="flex flex-col justify-start h-full p-24 pb-0 border-2">
            <div className="items-center justify-between h-fit ">
              <div className="flex items-center justify-between w-full">
                <div>
                  <div className="">
                    <div className="inline-flex items-center text-lg font-semibold ">
                      Invoice # :
                      <input
                        name="InvoiceNo"
                        type="text"
                        value={state.InvoiceNumber}
                        class="input input-ghost w-56 input-sm text-2xl  "
                        onChange={handleChange}
                      />
                    </div>
                    <br />
                    <span>Date</span>:{" "}
                    <input
                      name="Date"
                      type="text"
                      value={moment(state.Date).format("DD/MM/YYYY")}
                      class="input input-ghost w-56 input-sm text-lg font-semibold"
                      onChange={handleChange}
                    />
                    <br />
                  </div>
                  <br />
                  <b>
                    {
                      <input
                        name="CustomerName"
                        type="text"
                        placeholder="Customer Name"
                        value={state.CustomerName}
                        class="p-0 input input-ghost w-56 input-sm text-lg font-semibold"
                        onChange={handleChange}
                      />
                    }
                  </b>
                  <br />
                  {
                    <input
                      name="CustomerAddress"
                      type="text"
                      placeholder="Customer Address"
                      value={state.CustomerAddress}
                      class="p-0 input input-ghost w-56 input-sm text-lg font-semibold"
                      onChange={handleChange}
                    />
                  }
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
              <div className="px-3 mb-8 border border-t-2 border-gray-200"></div>
            </div>
            <div className="flex flex-col justify-between flex-grow ">
              <table className="table w-full border-2 table-auto ">
                <thead>
                  <tr>
                    <th></th>
                    <th>DESCRIPTION</th>
                    <th className="text-right">RATE</th>
                    <th className="text-right">UNITS</th>
                    <th className="text-right">SUBTOTAL</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {state.Items &&
                    state.Items.map((item, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>
                          {
                            <textarea
                              name="Description"
                              type="text"
                              value={item.Description}
                              class="p-0 textarea  textarea-ghost input-sm text-md w-64 h-fit "
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
                              name="Rate"
                              type="number"
                              value={item.Rate}
                              class="p-0 input input-ghost  input-sm text-md w-16"
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
                              type="number"
                              value={item.Units}
                              class="p-0 input input-ghost  input-sm text-md w-12"
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
                          {Number(item.Rate * item.Units)}
                        </td>
                        <td
                          className="print:hidden hover:text-red-500"
                          onClick={() => {
                            setState({
                              ...state,
                              Items: state.Items.filter((_, i) => i !== index),
                            });
                          }}
                        >
                          <IoIosRemoveCircleOutline />
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
              <div className="flex justify-center w-full h-16 animate-pulse print:hidden">
                <IoMdAddCircleOutline
                  size={30}
                  onClick={() =>
                    setState({ ...state, Items: [...state.Items, {}] })
                  }
                />
              </div>
              <div className="grid grid-cols-2 ">
                <div className="col-span-2 border border-t-2 border-gray-200 "></div>
                <span className="text-md">Sub Total: </span>
                <span className="text-lg font-semibold justify-self-end">
                  QAR{" "}
                  {state.Items &&
                    state.Items.reduce(
                      (a, b) => Number(a) + Number(b.Rate * b.Units),
                      0
                    )}
                </span>
                <span className="text-md">Discount: </span>
                <span className="text-lg justify-self-end">QAR 0</span>
                <span className="text-md">Other Charges: </span>
                <span className="text-lg justify-self-end">QAR 0</span>
              </div>
            </div>
            <div className="flex-grow p-8 pt-4 -mx-24 h-1/4 bg-base-200">
              <div className="flex-row px-4 mx-8 justify-self-end">
                <div className="w-full font-bold text-right">TOTAL DUE</div>
              </div>
              <div className="mx-4 border border-t-2 neutral "></div>
              <div className="flex flex-row items-center h-16 px-4 text-right align-middle justify-evenly bg-base-200">
                <div className="w-full mx-8 text-2xl font-bold text-primary">
                  QAR{" "}
                  {state.Items &&
                    state.Items.reduce(
                      (a, b) => Number(a) + Number(b.Rate * b.Units),
                      0
                    )}
                </div>
              </div>
              <div className="mx-4 border border-t-2 neutral "></div>
              <div className="mt-8 text-2xl text-center bg-base-200">
                <span>Thank you!</span>
              </div>
              <div className="px-3 text-sm text-center bg-base-200">
                hello@vbt.com ∖ www.vbt.com
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  );
}

Invoice.defaultProps = {
  CustomerName: "",
  CustomerAddress: "",
  Items: [],
  onPrint: () => {},
};

export default Invoice;
