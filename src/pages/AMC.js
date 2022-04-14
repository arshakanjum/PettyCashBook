import { ActiveAMCList } from "../components/ActiveAMCList";
import React from "react";
import FullCalendar from "@fullcalendar/react"; // must go before plugins
import dayGridPlugin from "@fullcalendar/daygrid";
import GridListWithSearch from "../components/Elements/GridListWithSearch";
import PageTitle from "../components/Typography/PageTitle";
import AddAMCCard from "../components/AddAMCCard";
import { InvoiceProvider } from "../context/InvoiceContext";

const items = [
  {
    id: 1,
    title: "Item 1",
    description: "Item 1 description",
  },
  {
    id: 1,
    title: "Item 1",
    description: "Item 1 description",
  },
  {
    id: 1,
    title: "Item 1",
    description: "Item 1 description",
  },
];

export default function AMC() {
  return (
    <>
      <div className="flex mb-4 h-fit">
        <div className=" w-full px-4">
          <AddAMCCard />
        </div>
      </div>
      <InvoiceProvider>
        <div className="flex mb-4">
          <div className="w-full h-full px-4">
            <ActiveAMCList />
          </div>
        </div>
      </InvoiceProvider>
    </>
  );
}
