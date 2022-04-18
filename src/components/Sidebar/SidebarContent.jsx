import React from "react";
import routes from "../../routes/sidebar";
import { Routes, NavLink, Route, Link } from "react-router-dom";
import SidebarSubmenu from "./SidebarSubmenu";

function SidebarContent() {
  return (
    <div className="py-4 text-gray-500 dark:text-gray-400">
      <a className="ml-6 text-lg font-bold text-primary " href="#">
        Apps
      </a>
      <ul className="mt-6">
        {routes.map((route) =>
            <li className="relative py-3" key={route.name}>
              <Link
                to={route.path}
                className="inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 dark:hover:text-gray-200"
                activeClassName="text-primary"
              >
                <span className="ml-2">{route.name}</span>
              </Link>
            </li>
        )}
      </ul>
    </div>
  );
}

export default SidebarContent;
