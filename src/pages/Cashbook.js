// import React, { useState } from "react";

// import PageTitle from "../components/Typography/PageTitle";
// import CTA from "../components/CTA";
// import {
//   Button,
//   Card,
//   Table,
//   TableCell,
//   TableHeader,
//   TableContainer,
//   TableBody,
// } from "@windmill/react-ui";
// import ExpenseCard from "../components/Cards/ExpenseCard";
// import HeaderCards from "../components/Cards/HeaderCards";
// import { useFirebaseApp, useFirestoreCollectionData } from "reactfire";
// import {
//   getFirestore,
//   query,
//   collection,
//   addDoc,
//   where,
//   Timestamp,
//   serverTimestamp,
//   orderBy,
//   writeBatch,
//   doc,
//   updateDoc,
// } from "firebase/firestore";

// import moment from "moment";
// import { textIndexToArray } from "../firebase";
// import ExpenseDetailModal from "../components/Cards/ExpenseDetailModal";

// function partition(array, isValid) {
//   return array.reduce(
//     ([pass, fail], elem) => {
//       return isValid(elem) ? [[...pass, elem], fail] : [pass, [...fail, elem]];
//     },
//     [[], []]
//   );
// }

// function getNewRVNumber(lastRV) {
//   var next = lastRV.replace(
//     /(RV)(\d+)-(\d+)+/,
//     function (fullMatch, pre, n, post) {
//       var nextNum = Number(n) + 1;
//       var yearDigits = moment().format("YY");
//       if (post != yearDigits) {
//         post = yearDigits;
//         nextNum = 1;
//       }
//       var digits = nextNum.toString().length;
//       if (digits <= 4) {
//         n = String(nextNum).padStart(4, "0");
//       }
//       return `${pre}${n}-${post}`;
//     }
//   );
//   return next;
// }

// function Cashbook() {
//   const db = getFirestore(useFirebaseApp());
//   const collectionRef = collection(db, "Transactions");
//   const q = query(collectionRef, orderBy("RVNumber"));
//   const { status, data: d } = useFirestoreCollectionData(q, {
//     q,
//     idField: "id",
//   });
//   var lastRV = "";
//   // var tr = [];
//   // var status = "loading";

//   const addTransaction = async (arg) => {
//     arg.RVNumber = getNewRVNumber(lastRV);
//     arg.Date = serverTimestamp();
//     arg.RVNumberIndex = textIndexToArray(arg.RVNumber);
//     // const batch = writeBatch(db);
//     // var newTransactionRef = collectionRef.doc();
//     // batch.update(doc(collectionRef, "RVNumber"), { RVNumber: arg.RVNumber });
//     // batch.set(newTransactionRef, arg);
//     // await batch.commit();
//     addDoc(collectionRef, arg);

//     updateDoc(doc(collectionRef, "RVNumber"), { RVNumber: arg.RVNumber });
//   };
//   if (!(status == "loading")) {
//     const tr = d.filter((e, idx) => {
//       if (e.id == "RVNumber") {
//         lastRV = e.RVNumber;
//         return false;
//       }
//       return true;
//     });

//     var advanceData = [],
//       directData = [];
//     [advanceData, directData] = partition(tr, (e) => e.IsAdvance);
//   }

//   const [isAddModalOpen, setIsAddModalOpen] = useState(false);
//   const [addAdvance, setAddAdvance] = useState(false);
//   const [addDirect, setAddDirect] = useState(false);

//   function openAddAdvance() {
//     setAddAdvance(true);
//   }

//   function openAddDirect() {
//     setAddDirect(true);
//   }

//   function openModal() {
//     setIsAddModalOpen(true);
//   }

//   function closeModal() {
//     setIsAddModalOpen(false);
//   }

//   return (
//     <>
//       {" "}
//       <div className="overflow-visible">
//         <div className="flex flex-col lg:justify-between lg:align-middle lg:flex-row ">
//           <PageTitle className="text-purple-600">Cashbook</PageTitle>
//           <div className="my-6">
//             <Button className="mx-2" onClick={openAddAdvance}>
//               Pay In Advance
//               <span className="ml-2" aria-hidden="true">
//                 +
//               </span>
//             </Button>
//             <Button className="mx-2" onClick={openAddDirect}>
//               Pay Direct Expense
//               <span className="ml-2" aria-hidden="true">
//                 +
//               </span>
//             </Button>
//           </div>
//         </div>
//         <div className="flex flex-wrap ">
//           <div className="w-full px-4 mb-10 overflow-y-auto xl:w-6/12 xl:mb-0">
//             <PageTitle>Advances</PageTitle>
//             {status == "loading" ? (
//               "Loading"
//             ) : (
//               <ExpenseCard
//                 newRVNumber={getNewRVNumber(lastRV)}
//                 isAdvance={true}
//                 addShown={addAdvance}
//                 setAddShown={setAddAdvance}
//                 data={advanceData}
//                 addTransaction={addTransaction}
//                 status={status}
//               />
//             )}
//           </div>
//           <div className="w-full px-4 mb-10 xl:w-6/12 xl:mb-0">
//             <PageTitle>Direct Expense</PageTitle>
//             {status == "loading" ? (
//               <div className="flex justify-around animate-bounce">
//                 <TableContainer className="h-full">
//                   <Table className="items-center w-full h-auto border-collapse table-fixed bg-base-100 ">
//                     <TableHeader className="text-purple-100 bg-purple-600 ">
//                       <tr>
//                         <TableCell className="w-1/5">RV Number</TableCell>
//                         <TableCell className="w-2/5">Employee</TableCell>
//                         <TableCell className="w-1/5">Amount</TableCell>
//                         <TableCell className="w-1/5">Status</TableCell>
//                       </tr>
//                     </TableHeader>
//                     <TableBody className="divide-none "></TableBody>
//                   </Table>
//                 </TableContainer>
//               </div>
//             ) : (
//               <ExpenseCard
//                 newRVNumber={getNewRVNumber(lastRV)}
//                 addShown={addDirect}
//                 setAddShown={setAddDirect}
//                 addTransaction={addTransaction}
//                 data={directData}
//                 status={status}
//               />
//             )}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// export default Cashbook;
