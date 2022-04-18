import React from "react";

import SidebarContent from "./SidebarContent";

function DesktopSidebar(props) {
  return (
    <aside className="fixed z-30 hidden w-56 m-4 mt-0 bg-white shadow-lg rounded-2xl h-2/3 top-24 lg:block">
      <SidebarContent />
    </aside>
  );
}

export default DesktopSidebar;
