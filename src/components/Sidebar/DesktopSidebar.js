import React from "react";

import SidebarContent from "./SidebarContent";

function DesktopSidebar(props) {
  return (
    <aside className="fixed z-30 hidden w-56 rounded-lg rounded-l-none shadow-lg bg-base-100 h-2/3 top-24 dark:bg-gray-800 lg:block">
      <SidebarContent />
    </aside>
  );
}

export default DesktopSidebar;
