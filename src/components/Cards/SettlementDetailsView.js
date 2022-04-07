import {
  addDoc,
  collection,
  doc,
  getFirestore,
  updateDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";
import React, { useState, useEffect, useRef } from "react";
import { useFirebaseApp, useFirestoreCollectionData } from "reactfire";
import {
  Button,
  Label,
  Input,
  Textarea,
  TableContainer,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
  Backdrop,
} from "@windmill/react-ui";
import { enGB } from "date-fns/locale";
import NumberFormat from "react-number-format";
import CreatableSelect, { useCreatable } from "react-select/creatable";
import moment from "moment";
import { BackIcon } from "../../icons";
import Loader from "../Elements/Loader";
import DatePicker from "react-multi-date-picker";
import "react-multi-date-picker/styles/colors/purple.css";
import { getNewRVNumber, setNewRVNumber } from "../../firebase";
import ReceiptVoucher from "./ReceiptVoucher";
import { useReactToPrint } from "react-to-print";
import ConfirmationModal from "./ConfirmationModal";
import { get } from "firebase/database";
import Table from "react-tailwind-table";
function SettlementBalanceTable(props) {
  var Amount = 0,
    Settlement = 0;
  props.transaction.map((a) => {
    Amount = Number(Amount) + Number(a.Amount);
  });
  props.bills.map((a) => {
    Settlement = Number(Settlement) + Number(a.Amount);
  });
  var Balance = Amount - Settlement;
  return (
    <>
      {/* <Settlements transaction={props.transactions} /> */}
      <div className="flex justify-between px-4 py-1 mx-4 my-2 bg-gray-100 rounded-lg">
        <span>Total Amount</span>
        <span>QAR {Amount}</span>
      </div>
      {props.transaction[0].IsAdvance ? (
        <div className="flex justify-between px-4 py-1 mx-4 my-2 bg-gray-100 rounded-lg">
          <span>Total Settlement</span>
          <span>QAR {Settlement}</span>
        </div>
      ) : null}
      {props.bills.length > 0 ? (
        Balance >= 0 ? (
          <div className="flex justify-between px-4 py-1 mx-4 my-2 bg-green-200 rounded-lg">
            <span>Balance Return</span>
            <span>QAR {Balance}</span>
          </div>
        ) : (
          <div className="flex justify-between px-4 py-1 mx-4 my-2 bg-red-200 rounded-lg">
            <span>Balance Payment</span>
            <span>QAR {Balance}</span>
          </div>
        )
      ) : null}
    </>
  );
}

function TextField(props) {
  return (
    <Label>
      <span>{props.label}</span>
      <Input
        name={props.name}
        onChange={(e) => {
          const { name, value } = e.target;
          props.valueSet((prevState) => ({
            ...prevState,
            [name]: value,
          }));
        }}
        className="border-gray-200 rounded-md shadow-md bg-purple-50"
      />
    </Label>
  );
}
function CreatableSelectFields(props) {
  const [projects, setProjects] = useState([]);
  const db = getFirestore(useFirebaseApp());
  const projRef = collection(db, "Projects");

  useEffect(() => {
    var querySnapshot;
    var arr = [];
    async function fetchData() {
      querySnapshot = await getDocs(projRef);
      querySnapshot.forEach((projectDoc) => {
        var project = {
          value: projectDoc.id,
          label: projectDoc.data().Name,
        };
        arr.push(project);
      });
      setProjects(arr);
    }
    fetchData();
  }, []);

  const addProject = async (arg) => {
    addDoc(projRef, arg);
  };

  return (
    <Label className="w-1/2">
      <span className="ml-2">Project</span>
      <CreatableSelect
        isClearable
        onChange={(newValue, actionMeta) => {
          if (newValue.__isNew__) addProject({ Name: newValue.value });
          props.valueSet((prevState) => ({
            ...prevState,
            Project: newValue,
          }));
        }}
        options={projects}
      />
    </Label>
  );
}
function NumberField(props) {
  return (
    <div>
      <Label>
        <span className="">{props.label}</span>

        <NumberFormat
          className="border-gray-200 rounded-md shadow-md disabled min-w-2 bg-purple-50"
          thousandsGroupStyle="thousand"
          prefix="QAR "
          decimalSeparator="."
          displayType="input"
          type="text"
          thousandSeparator={true}
          allowNegative={false}
          placeholder="QAR "
          customInput={Input}
          defaultValue={0}
          onValueChange={(values, sourceInfo) => {
            const { name } = props;
            props.valueSet((prevState) => ({
              ...prevState,
              [name]: values.value,
            }));
          }}
        />
      </Label>
    </div>
  );
}
export function SettlementsTable(props) {
  // const [bills, setBills] = useState("");
  const db = getFirestore(useFirebaseApp());
  const BRef = collection(db, "Settlements");
  const [settlement, setSettlement] = useState({});
  const [loading, setLoading] = useState(true);

  var transactions;
  const componentRef = useRef();
  useEffect(() => {
    setLoading(true);
    var querySnapshot;
    var arr = [];
    var idArr = props.transaction.map((a) => a.id);
    async function fetchData() {
      var q = query(BRef, where("Advances", "array-contains-any", idArr));
      querySnapshot = await getDocs(q);
      querySnapshot.forEach((settlementDoc) => {
        var settlement = settlementDoc.data();
        settlement.id = settlementDoc.id;
        setSettlement(settlement);
      });
    }
    fetchData();
    setLoading(false);
  }, [props.transaction]);

  var handlePrint = useReactToPrint({
    content: () => componentRef.current,
    // onAfterPrint: () => {
    //   updateDoc(docRef, {
    //     IsPrinted: true,
    //     CashReceivedIn: "Cash",
    //     PrintTime: serverTimestamp(),
    //   }).then(() => {
    //     setLoading(false);
    //   });
    // },
  });

  var onClickPrint = () => {
    setLoading(true);
    handlePrint();
  };
  transactions = settlement.AdvancesDetails;
  // setBills(b);
  if (!settlement.Bills) {
    return <Loader />;
  }

  return (
    <>
      <div className="hidden">
        <div className="block" ref={componentRef}>
          <ReceiptVoucher
            transaction={props.transaction[0]}
            isSettlement={false}
            selectedRadio={"Cash"}
          />
        </div>
      </div>
      <div className="max-w-screen-xl px-4">
        <div className="flex flex-wrap justify-start -mx-4">
          {transactions.map((transaction, idx) => (
            <div className="w-full p-4 mx-2 my-auto transition-all sm:w-1/2 lg:w-1/4 xl:w-1/8">
              <div
                tabindex="0"
                className="px-4 py-2 bg-purple-200 rounded-lg shadow-lg "
              >
                <div className="p-2 mb-2 text-sm font-medium text-center text-gray-700 align-middle bg-purple-100 rounded-full dark:text-gray-200 ">
                  {moment(transaction.Date.toDate()).format("DD-MM-YY")}
                </div>
                <p className="font-semibold text-gray-700 text-md dark:text-gray-200 ">
                  {transaction.RVNumber}
                </p>
                <p className="text-sm text-right text-gray-700 dark:text-gray-200">
                  QAR{" "}
                  <span className="font-semibold text-md">
                    {transaction.Amount}
                  </span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="pr-8 text-right rounded-full text-md">
        Settlement RV: <b>{settlement.RVNumber}</b>
      </div>
      <div className="pr-8 text-right text-mdrounded-full">
        Settlement Date:{" "}
        <b>{moment(settlement.Date.toDate()).format("DD-MM-YYYY")}</b>
      </div>
      <SettlementBalanceTable
        transaction={transactions}
        bills={settlement.Bills}
      />
      <BillsTable Bills={settlement.Bills} />
    </>
  );
}

export function BillsTable({ Bills }) {
  var shapedData = {};
  if (!Bills || Bills.length == 0) return;
  Bills.map((bill, idx) => {
    if (!(bill.SettlementCategory in shapedData)) {
      shapedData[bill.SettlementCategory] = [];
    }
    shapedData[bill.SettlementCategory].push(bill);
  });
  return (
    <table className="min-w-full text-center">
      <thead className="border-b bg-base-100">
        <tr>
          <th
            scope="col"
            className="px-6 py-2 text-sm font-medium text-gray-900"
          >
            #
          </th>
          <th
            scope="col"
            className="px-6 py-2 text-sm font-medium text-gray-900"
          >
            First
          </th>
          <th
            scope="col"
            className="px-6 py-2 text-sm font-medium text-gray-900"
          >
            Last
          </th>
          <th
            scope="col"
            className="px-6 py-2 text-sm font-medium text-gray-900"
          >
            Handle
          </th>
        </tr>
      </thead>
      <tbody>
        <tr className="border-b bg-base-100">
          <td className="px-6 py-2 text-sm font-medium text-gray-900 whitespace-nowrap">
            1
          </td>
          <td className="px-6 py-2 text-sm font-light text-gray-900 whitespace-nowrap">
            Mark
          </td>
          <td className="px-6 py-2 text-sm font-light text-gray-900 whitespace-nowrap">
            Otto
          </td>
          <td className="px-6 py-2 text-sm font-light text-gray-900 whitespace-nowrap">
            @mdo
          </td>
        </tr>
        <tr className="border-b bg-base-100">
          <td className="px-6 py-2 text-sm font-medium text-gray-900 whitespace-nowrap">
            2
          </td>
          <td className="px-6 py-2 text-sm font-light text-gray-900 whitespace-nowrap">
            Jacob
          </td>
          <td className="px-6 py-2 text-sm font-light text-gray-900 whitespace-nowrap">
            Thornton
          </td>
          <td className="px-6 py-2 text-sm font-light text-gray-900 whitespace-nowrap">
            @fat
          </td>
        </tr>
        <tr className="border-b bg-base-100">
          <td className="px-6 py-2 text-sm font-medium text-gray-900 whitespace-nowrap">
            3
          </td>
          <td
            colspan="2"
            className="px-6 py-2 text-sm font-light text-center text-gray-900 whitespace-nowrap"
          >
            Larry the Bird
          </td>
          <td className="px-6 py-2 text-sm font-light text-gray-900 whitespace-nowrap">
            @twitter
          </td>
        </tr>
      </tbody>
    </table>
  );
}
// return Object.keys(shapedData).map((key) => (

// <TableContainer className="rounded-lg ">
//   <span className="w-full text-sm font-bold text-center rounded-full ">
//     {key}
//   </span>
//   <Table className="w-full table-fixed">
//     <TableHeader className="break-normal bg-purple-300 rounded-full text-base-content ">
//       <tr>
//         <TableCell>Date</TableCell>
//         <TableCell>No.</TableCell>
//         <TableCell>Amount</TableCell>
//         {(() => {
//           switch (key) {
//             case "Petrol":
//               return <TableCell>Vehicle</TableCell>;
//             case "Materials & Labors":
//               return (
//                 <>
//                   <TableCell>Site/Client/Project</TableCell>
//                   <TableCell>Desc</TableCell>
//                 </>
//               );
//             case "Other Expenses":
//               return (
//                 <>
//                   <TableCell>Stationary</TableCell>
//                   <TableCell>Tools / Consumables</TableCell>
//                   <TableCell>Vehicle Expenses</TableCell>
//                   <TableCell>Miscellaneous</TableCell>
//                 </>
//               );
//             case "Employee Benefits":
//               return <TableCell>Description</TableCell>;
//             default:
//               return null;
//           }
//         })()}
//       </tr>
//     </TableHeader>
//     <TableBody>
//       {shapedData[key].map((b) => (
//         <TableRow>
//           <TableCell className="p-0">
//             <p className="text-sm font-semibold">
//               {moment(b.Date.toDate()).format("DD-MMMM-YYYY")}
//             </p>
//           </TableCell>
//           <TableCell>
//             <span className="text-sm">{b.Number}</span>
//           </TableCell>
//           <TableCell>{b.Amount}</TableCell>
//           {(() => {
//             switch (key) {
//               case "Petrol":
//                 return <TableCell>{b.Vehicle}</TableCell>;
//               case "Materials & Labors":
//                 return (
//                   <>
//                     <TableCell>{b.Project.label}</TableCell>
//                     <TableCell>{b.Desc}</TableCell>
//                   </>
//                 );
//               case "Other Expenses":
//                 return (
//                   <>
//                     <TableCell>{b.Stationary}</TableCell>
//                     <TableCell>{b.ToolsConsumables}</TableCell>
//                     <TableCell>{b.Vehicle}</TableCell>
//                     <TableCell>{b.Miscellaneous}</TableCell>
//                   </>
//                 );
//               case "Employee Benefits":
//                 return <TableCell>{b.Desc}</TableCell>;
//               default:
//                 return null;
//             }
//           })()}
//         </TableRow>
//       ))}
//     </TableBody>
//   </Table>
// </TableContainer>
// ));
// }

function SettlementsEdit(props) {
  // const [bills, setBills] = useState("");
  const [bills, setBills] = useState([]);
  useEffect(() => {
    setBills(props.bills);
  }, [props.bills]);

  var shapedData = {};
  // setBills(b);
  bills.map((bill, idx) => {
    if (!(bill.SettlementCategory in shapedData)) {
      shapedData[bill.SettlementCategory] = [];
    }
    shapedData[bill.SettlementCategory].push(bill);
  });

  return (
    <>
      {Object.keys(shapedData).map((key) => (
        <TableContainer className="p-2 rounded-lg ">
          <span className="text-lg text-center rounded-full ">{key}</span>
          {/* <Table className="w-full table-fixed">
            <TableHeader className="break-normal bg-purple-300 rounded-full text-base-content ">
              <tr>
                <TableCell>Date</TableCell>
                <TableCell>No.</TableCell>
                <TableCell>Amount</TableCell>
                {(() => {
                  switch (key) {
                    case "Petrol":
                      return <TableCell>Vehicle</TableCell>;
                    case "Materials & Labors":
                      return (
                        <>
                          <TableCell>Site/Client/Project</TableCell>
                          <TableCell>Desc</TableCell>
                        </>
                      );
                    case "Other Expenses":
                      return (
                        <>
                          <TableCell>Stationary</TableCell>
                          <TableCell>Tools / Consumables</TableCell>
                          <TableCell>Vehicle Expenses</TableCell>
                          <TableCell>Miscellaneous</TableCell>
                        </>
                      );
                    case "Employee Benefits":
                      return <TableCell>Description</TableCell>;
                    default:
                      return null;
                  }
                })()}
              </tr>
            </TableHeader>
            <TableBody>
              {shapedData[key].map((b) => (
                <TableRow>
                  <TableCell>
                    <p className="font-semibold">{b.Date.toDateString()}</p>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{b.Number}</span>
                  </TableCell>
                  <TableCell>{b.Amount}</TableCell>
                  {(() => {
                    switch (key) {
                      case "Petrol":
                        return <TableCell>{b.Vehicle}</TableCell>;
                      case "Materials & Labors":
                        return (
                          <>
                            <TableCell>{b.Project.label}</TableCell>
                            <TableCell>{b.Desc}</TableCell>
                          </>
                        );
                      case "Other Expenses":
                        return (
                          <>
                            <TableCell>{b.Stationary}</TableCell>
                            <TableCell>{b.ToolsConsumables}</TableCell>
                            <TableCell>{b.Vehicle}</TableCell>
                            <TableCell>{b.Miscellaneous}</TableCell>
                          </>
                        );
                      case "Employee Benefits":
                        return <TableCell>{b.Desc}</TableCell>;
                      default:
                        return null;
                    }
                  })()}
                </TableRow>
              ))}
            </TableBody>
          </Table> */}
          HERE
        </TableContainer>
      ))}
    </>
  );
}

function SettlementDetailsView(props) {
  const [bills, setBills] = useState([]);
  const [transactions, setTransactions] = useState(props.transactions);
  const [isPrinted, setIsPrinted] = useState(
    props.transactions[0].IsPrinted ?? false
  );
  const [IsSettled, setIsSettled] = useState(transactions[0].IsSettled);
  const setRef = collection(db, "Settlements");
  const db = getFirestore(useFirebaseApp());
  const transRef = collection(db, "Transactions");
  const componentRef = useRef();
  const settlementComponentRef = useRef();
  const [selectedRadio, setSelectedRadio] = useState(
    props.transactions[0].CashReceivedIn ?? "Cash"
  );
  const [printingLoading, setPrintingLoading] = useState(false);
  const [confirmationModalVisible, setConfirmationModalVisible] =
    useState(false);
  const [settlement, setSettlement] = useState({
    Number: "",
    Amount: "",
    Date: new Date(),
    SettlementCategory: "",
    Vehicle: 0,
    Stationary: 0,
    ToolsConsumables: 0,
    Miscellaneous: 0,
  });

  var setDate = (val) => {
    setSettlement((prevState) => ({
      ...prevState,
      Date: val,
    }));
  };
  var RVPrint = useReactToPrint({
    content: () => componentRef.current,
    onAfterPrint: () => {
      var updatePromiseArr = [],
        promiseArr = [];
      props.transactions.map((transaction, idx) => {
        var docRef = doc(transRef, transaction.id);
        updatePromiseArr.push(
          updateDoc(docRef, {
            IsPrinted: true,
            CashReceivedIn: selectedRadio,
            PrintTime: serverTimestamp(),
          })
        );
        // .then( () => {
        //   setIsPrinted(true);
        //   promiseArr.push(getDoc(docRef));
        // });
        // Promise.all(promiseArr).then((val) => {
        //   setTransactions(val)
        // })
      });
      Promise.all(updatePromiseArr).then(() => {
        props.transactions.map((transaction, idx) => {
          var docRef = doc(transRef, transaction.id);
          promiseArr.push(getDoc(docRef));
        });
        Promise.all(promiseArr).then((val) => {
          setTransactions(val.map((a) => a.data()));
          setPrintingLoading(false);
        });
      });
    },
  });

  var handlePrint = () => {
    if (isPrinted) {
      setPrintingLoading(true);
      RVPrint();
    } else {
      setConfirmationModalVisible(true);
    }
  };

  var handleSettlementPrint = useReactToPrint({
    content: () => settlementComponentRef.current,
  });

  const AddSettlement = async () => {
    console.log(settlement);
    var newDoc = {};
    newDoc.Advances = [];
    newDoc.AdvancesDetails = [];
    transactions.forEach((x) => {
      newDoc.Advances.push(x.id);
      newDoc.AdvancesDetails.push(x);
      newDoc.Name = x.Name;
    });
    newDoc.Bills = bills;
    newDoc.SettlementAmount = bills.reduce((acc, curr) => {
      acc = Number(acc) + Number(curr.Amount);
      return acc;
    }, 0);
    newDoc.Amount = transactions.reduce((acc, curr) => {
      acc = Number(acc) + Number(curr.Amount);
      return acc;
    }, 0);

    newDoc.Date = serverTimestamp();
    newDoc.RVNumber = await getNewRVNumber();
    var setDocRef = await addDoc(setRef, newDoc);
    setNewRVNumber(newDoc.RVNumber);
    transactions.forEach((x) =>
      updateDoc(doc(transRef, x.id), {
        IsSettled: true,
        Settlement: {
          id: setDocRef.id,
          RVNumber: newDoc.RVNumber,
          SettlementAmount: newDoc.SettlementAmount,
          Date: newDoc.Date,
        },
      })
    );
    setIsSettled(true);
    props.transactions.map((transaction, idx) => {
      transaction.settlement = setDocRef.data();
    });
    props.onSaveSettlement();
  };

  const AddBill = () => {
    if (settlement.SettlementCategory == "Other Expenses") {
      settlement.Amount =
        Number(settlement.Stationary) +
        Number(settlement.ToolsConsumables) +
        Number(settlement.Vehicle) +
        Number(settlement.Miscellaneous);
    }
    setBills([...bills, settlement]);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettlement((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleAmountChange = (e) => {
    setSettlement((prevState) => ({
      ...prevState,
      Amount: e.value,
    }));
  };
  if (!transactions || transactions.length == 0) {
    return <Loader />;
  }

  // var handlePrint = useReactToPrint({
  //   content: () => componentRef.current,

  // });

  return (
    <>
      {printingLoading ? (
        <div className="absolute left-50 right-50 top-50 bottom-50">
          <Backdrop />
          <Loader />
        </div>
      ) : null}
      <div className="p-2 rounded-lg bg-base-100">
        <div className="flex justify-end w-full ">
          {/* <div
              className="w-6 h-6 m-2 hover:text-primary"
              onClick={() => props.onClose(false)}
            >
              <BackIcon />
            </div> */}
          <div className="flex flex-row justify-end w-1/3 m-2">
            {IsSettled ? (
              <Button
                layout="outline"
                className="mx-2 transition-all min-w-fit"
                onClick={handleSettlementPrint}
              >
                Print Settlement RV
              </Button>
            ) : null}
          </div>
        </div>

        {IsSettled ? (
          <SettlementsTable
            transaction={props.transactions}
            innerRef={settlementComponentRef}
          />
        ) : (
          <>
            <SettlementBalanceTable
              transaction={props.transactions}
              bills={bills}
            />

            <SettlementsEdit transaction={props.transactions} bills={bills} />
            {bills.length > 0 ? (
              <div className="flex justify-end w-full">
                <Button
                  layout="primary"
                  className="w-1/6 mx-2 transition-all "
                  onClick={AddSettlement}
                >
                  Save Settlement
                </Button>
              </div>
            ) : null}
          </>
        )}
      </div>

      {props.transactions[0].IsAdvance && !IsSettled ? (
        <div className="flex flex-wrap justify-end mx-8 mt-2 border-l-8 rounded-lg shadow-lg bg-base-100 border-primary">
          <div className="w-full text-white rounded-lg rounded-l-none bg-primary">
            <span className="ml-1">Add Bill</span>
          </div>
          <div className="w-full px-2 ">
            <span>Bill Type</span>
            <div className="space-x-2 gap-x-2 justify-items-start">
              <button
                className={
                  settlement.SettlementCategory == "Petrol"
                    ? "btn btn-active"
                    : "btn btn-outline"
                }
                onClick={(e) =>
                  setSettlement((prevState) => ({
                    ...prevState,
                    SettlementCategory: "Petrol",
                  }))
                }
              >
                Petrol
              </button>
              <button
                className={
                  settlement.SettlementCategory == "Materials & Labors"
                    ? "btn "
                    : "btn btn-outline"
                }
                onClick={(e) =>
                  setSettlement((prevState) => ({
                    ...prevState,
                    SettlementCategory: "Materials & Labors",
                  }))
                }
              >
                Materials & Labors
              </button>
              <button
                className={
                  settlement.SettlementCategory == "Other Expenses"
                    ? "btn "
                    : "btn btn-outline"
                }
                onClick={(e) =>
                  setSettlement((prevState) => ({
                    ...prevState,
                    SettlementCategory: "Other Expenses",
                  }))
                }
              >
                Other Expenses
              </button>
              <button
                className={
                  settlement.SettlementCategory == "Employee Benefits"
                    ? "btn "
                    : "btn btn-outline"
                }
                onClick={(e) =>
                  setSettlement((prevState) => ({
                    ...prevState,
                    SettlementCategory: "Employee Benefits",
                  }))
                }
              >
                Employee Benefits
              </button>
            </div>
            {settlement.SettlementCategory ? (
              <div className="inline-flex flex-row w-full mb-1 space-x-2 justify-evenly">
                <Label>
                  <span>Date</span>

                  <div>
                    <DatePicker
                      className="purple"
                      value={settlement.Date}
                      onChange={setDate}
                      numberOfMonths={2}
                      format="DD/MM/YYYY"
                      render={(value, openCalendar) => {
                        return (
                          <Input
                            value={value}
                            onFocus={openCalendar}
                            className="w-full border-gray-200 rounded-md shadow-md bg-purple-50"
                          />
                        );
                      }}
                    />
                  </div>
                </Label>
                <TextField
                  name={"Number"}
                  valueSet={setSettlement}
                  label={"Invoice Number"}
                />
                {settlement.SettlementCategory != "Other Expenses" ? (
                  <Label>
                    <span>Amount</span>
                    <NumberFormat
                      className="border-gray-200 rounded-md shadow-md bg-purple-50"
                      thousandsGroupStyle="thousand"
                      prefix="QAR "
                      decimalSeparator="."
                      displayType="input"
                      type="text"
                      thousandSeparator={true}
                      allowNegative={false}
                      placeholder="QAR "
                      customInput={Input}
                      defaultValue={0}
                      onValueChange={handleAmountChange}
                      name="Amount"
                    />
                  </Label>
                ) : null}
                {settlement.SettlementCategory == "Petrol" ? (
                  <TextField
                    valueSet={setSettlement}
                    label={"Vehicle Number"}
                    name={"Vehicle"}
                  />
                ) : settlement.SettlementCategory == "Materials & Labors" ? (
                  <>
                    <CreatableSelectFields valueSet={setSettlement} />
                    <Label>
                      .<span>Description</span>
                      <Textarea
                        onChange={handleChange}
                        name="Desc"
                        className="mr-2 border-gray-200 rounded-md shadow-md bg-purple-50"
                        rows="1"
                      />
                    </Label>
                  </>
                ) : settlement.SettlementCategory == "Other Expenses" ? (
                  <>
                    <NumberField
                      valueSet={setSettlement}
                      label={"Stationary"}
                      name={"Stationary"}
                    />
                    <NumberField
                      valueSet={setSettlement}
                      label={"Tools & Consumables"}
                      name={"ToolsConsumables"}
                    />
                    <NumberField
                      valueSet={setSettlement}
                      label={"Vehicle Expenses"}
                      name={"Vehicle"}
                    />
                    <NumberField
                      valueSet={setSettlement}
                      label={"Miscellaneous"}
                      name={"Miscellaneous"}
                    />
                  </>
                ) : (
                  <Label>
                    <span>Description</span>
                    <Textarea
                      onChange={handleChange}
                      name="Desc"
                      className="mr-2 border-gray-200 rounded-md shadow-md bg-purple-50"
                      rows="1"
                    />
                  </Label>
                )}
              </div>
            ) : null}
          </div>
          <div className="flex w-1/3 gap-2 p-2 space-x-2 ">
            <Button onClick={props.onClose} layout="outline" className="w-1/2 ">
              Cancel
            </Button>
            <Button onClick={AddBill} layout="primary" className="w-1/2">
              Add
            </Button>
          </div>
        </div>
      ) : null}
    </>
  );
}

export default SettlementDetailsView;

SettlementDetailsView.defaultProps = {
  showTransactions: true,
};
