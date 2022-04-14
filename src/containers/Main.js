import React from "react";

function Main({ children }) {
  return (
    <main className="fixed items-center w-full ">
      <div className="flex flex-col justify-start w-full pt-24 pl-64 h-screen">
        {children}
      </div>
    </main>
  );
}

export default Main;
