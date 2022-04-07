import React from "react";

function Main({ children }) {
  return (
    <main className="h-full ">
      <div className="grid pt-32 pr-10 pl-72 ">{children}</div>
    </main>
  );
}

export default Main;
