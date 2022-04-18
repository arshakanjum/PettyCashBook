import { initializeApp } from "firebase/app";
import { doc, getDoc, getFirestore, updateDoc } from "firebase/firestore";
import moment from "moment";
const firebaseConfig = {
  apiKey: "AIzaSyBTkbLiepCKD1ldsZuUqhKRWEoljSM2rGA",
  authDomain: "betty-f5e9a.firebaseapp.com",
  projectId: "betty-f5e9a",
  storageBucket: "betty-f5e9a.appspot.com",
  messagingSenderId: "671068804417",
  appId: "1:671068804417:web:745d9c006f92c09630bdc0",
};
var firebaseApp = initializeApp(firebaseConfig);
export default firebaseConfig;

export const textIndexToArray = (str) => {
  const string = str.trim().replace(/ +(?= )/g, "");
  let arr = [];
  for (let i = 0; i < string.trim().length; i++) {
    arr.push(string.substr(0, i + 1).toLowerCase());
  }
  return arr;
};

export async function getNewRVNumber() {
  var db = getFirestore(firebaseApp);
  const docRef = doc(db, "Data", "config");
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    var data = docSnap.data();
    var lastRV = data.RVNumber;
    var next = lastRV.replace(
      /(RV)(\d+)-(\d+)+/,
      function (fullMatch, pre, n, post) {
        var nextNum = Number(n) + 1;
        var yearDigits = moment().format("YY");
        if (post != yearDigits) {
          post = yearDigits;
          nextNum = 1;
        }
        var digits = nextNum.toString().length;
        if (digits <= 4) {
          n = String(nextNum).padStart(4, "0");
        }
        return `${pre}${n}-${post}`;
      }
    );
    return next;
  } else {
    // doc.data() will be undefined in this case
    console.log("No such document!");
  }
}
export async function setNewRVNumber(RVNumber) {
  var db = getFirestore(firebaseApp);
  const docRef = doc(db, "Data", "config");
  await updateDoc(docRef, { RVNumber: RVNumber });
}

export async function getNewInvoiceNumber() {
  var db = getFirestore(firebaseApp);
  const docRef = doc(db, "Data", "config");
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    var data = docSnap.data();
    var lastRV = data.InvoiceNumber;
    var next = lastRV.replace(
      /(INV)(\d+)-(\d+)+/,
      function (fullMatch, pre, n, post) {
        var nextNum = Number(n) + 1;
        var yearDigits = moment().format("YY");
        if (post != yearDigits) {
          post = yearDigits;
          nextNum = 1;
        }
        var digits = nextNum.toString().length;
        if (digits <= 4) {
          n = String(nextNum).padStart(4, "0");
        }
        return `${pre}${n}-${post}`;
      }
    );
    return next;
  } else {
    // doc.data() will be undefined in this case
    console.log("No such document!");
  }
}
export async function setNewInvoiceNumber(InvoiceNumber) {
  var db = getFirestore(firebaseApp);
  const docRef = doc(db, "Data", "config");
  await updateDoc(docRef, { InvoiceNumber: InvoiceNumber });
}
