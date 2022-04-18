import React from "react";

function Main({ children }) {
  return (
    <main className="fixed items-center w-screen h-screen">
      <div className="flex flex-col justify-start h-screen pt-24 pb-4 pl-64 pr-4 bg-base-200 scrollbar-thin scrollbar-thumb-black scrollbar-track-white scrollbar-thumb-rounded-full scrollbar-track-rounded-full">
        {children}
      </div>
    </main>
  );
}

export default Main;
