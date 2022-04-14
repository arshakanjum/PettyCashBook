import React from "react";

import SidebarContent from "./SidebarContent";

function DesktopSidebar(props) {
  return (
    <aside className="fixed z-30 hidden w-56 m-4 mt-0   shadow-lg bg-base-200 h-2/3 top-24 lg:block">
      <SidebarContent />
    </aside>
  );
}

export default DesktopSidebar;
