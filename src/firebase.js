import { async } from "@firebase/util";
import { FirebaseApp, initializeApp } from "firebase/app";
import { doc, getDoc, getFirestore, updateDoc } from "firebase/firestore";
import moment from "moment";
const firebaseConfig = {
  apiKey: "AIzaSyDg85NAb8X3AFT9uGj0HGgwolSTNshHpp4",
  authDomain: "petty-cash-book-1c2cf.firebaseapp.com",
  projectId: "petty-cash-book-1c2cf",
  storageBucket: "petty-cash-book-1c2cf.appspot.com",
  messagingSenderId: "582898892986",
  appId: "1:582898892986:web:95602c196a936716b48283",
};
const firebaseApp = initializeApp(firebaseConfig);

console.log("test");
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
  const docRef = doc(db, "Transactions", "RVNumber");
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
  const docRef = doc(db, "Transactions", "RVNumber");
  await updateDoc(docRef, { RVNumber: RVNumber });
}
