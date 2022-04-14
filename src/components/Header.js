import React, { useContext, useState } from "react";
import { SidebarContext } from "../context/SidebarContext";
import {
  SearchIcon,
  MoonIcon,
  SunIcon,
  BellIcon,
  MenuIcon,
  OutlinePersonIcon,
  OutlineCogIcon,
  OutlineLogoutIcon,
} from "../icons";
import {
  Avatar,
  Badge,
  Input,
  Dropdown,
  DropdownItem,
  WindmillContext,
  Button,
} from "@windmill/react-ui";
import HeaderCards from "./Cards/HeaderCards";

function Header() {
  const { mode, toggleMode } = useContext(WindmillContext);
  const { toggleSidebar } = useContext(SidebarContext);

  const [isNotificationsMenuOpen, setIsNotificationsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  function handleNotificationsClick() {
    setIsNotificationsMenuOpen(!isNotificationsMenuOpen);
  }

  function handleProfileClick() {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  }

  return (
    // <div class="fixed w-full inline-flex items-center p-4">
    <div class="navbar w-full bg-base-200 m-4">
      <div class="flex-1">
        <a class="btn btn-ghost normal-case text-xl">
          Virtual Bridge for Technology
        </a>
      </div>
      <div class="flex-none">
        <div class="dropdown dropdown-end">
          <label tabindex="0" class="btn btn-ghost btn-circle">
            <div class="indicator">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <span class="badge badge-sm indicator-item">8</span>
            </div>
          </label>
          <div
            tabindex="0"
            class="mt-3 card card-compact dropdown-content w-52 bg-base-100 shadow"
          >
            <ul class="menu bg-base-100 w-56">
              <li>
                <a>Item 1</a>
              </li>
              <li>
                <a class="active">Item 2</a>
              </li>
              <li>
                <a>Item 3</a>
              </li>
            </ul>
          </div>
        </div>
        <div class="dropdown dropdown-end">
          <label tabindex="0" class="btn btn-ghost btn-circle avatar">
            <div class="w-10 rounded-full">
              <img src="https://api.lorem.space/image/face?hash=33791" />
            </div>
          </label>
          <ul
            tabindex="0"
            class="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <a class="justify-between">
                Profile
                <span class="badge">New</span>
              </a>
            </li>
            <li>
              <a>Settings</a>
            </li>
            <li>
              <a>Logout</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <header className="fixed z-40 w-full py-4 border-b-2 rounded-t-none shadow-md bg-base-100 border-primary dark:bg-gray-800">
        <div className="container flex items-center justify-between h-full mx-auto text-primary dark:text-primary">
          {/* <!-- Mobile hamburger --> */}
          <button
            className="p-1 mr-5 -ml-2 xl:hidden focus:outline-none focus:shadow-outline-primary"
            onClick={toggleSidebar}
            aria-label="Menu"
          >
            <MenuIcon className="w-6 h-6" aria-hidden="true" />
          </button>

          {/* <!-- Search input --> */}
          <div className="flex justify-center flex-1 lg:mr-32 ">
            <div className="relative w-full max-w-xl mr-6 focus-within:text-primary">
              <Input
                className="pl-8 placeholder-primary text-primary border-primary"
                placeholder="Search for projects"
                aria-label="Search"
              />
              <div className="absolute inset-y-0 flex items-center px-2 rounded-full ">
                <SearchIcon className="w-4 h-4" aria-hidden="true" />
              </div>
            </div>
          </div>
          <ul className="flex items-center flex-shrink-0 space-x-6">
            {/* <!-- Theme toggler --> */}
            <li className="flex">
              <button
                className=" focus:outline-none focus:shadow-outline-primary"
                onClick={toggleMode}
                aria-label="Toggle color mode"
              >
                {mode === "dark" ? (
                  <SunIcon className="w-5 h-5" aria-hidden="true" />
                ) : (
                  <MoonIcon className="w-5 h-5" aria-hidden="true" />
                )}
              </button>
            </li>
            {/* <!-- Notifications menu --> */}
            <li className="relative">
              <button
                className="relative align-middle focus:outline-none focus:shadow-outline-primary"
                onClick={handleNotificationsClick}
                aria-label="Notifications"
                aria-haspopup="true"
              >
                <BellIcon className="w-5 h-5" aria-hidden="true" />
                {/* <!-- Notification badge --> */}
                <span
                  aria-hidden="true"
                  className="absolute top-0 right-0 inline-block w-3 h-3 transform translate-x-1 -translate-y-1 bg-red-600 border-2 border-white rounded-full dark:border-gray-800"
                ></span>
              </button>

              <Dropdown
                align="right"
                isOpen={isNotificationsMenuOpen}
                onClose={() => setIsNotificationsMenuOpen(false)}
              >
                <DropdownItem tag="a" href="#" className="justify-between">
                  <span>Messages</span>
                  <Badge type="danger">13</Badge>
                </DropdownItem>
                <DropdownItem tag="a" href="#" className="justify-between">
                  <span>Sales</span>
                  <Badge type="danger">2</Badge>
                </DropdownItem>
                <DropdownItem onClick={() => alert("Alerts!")}>
                  <span>Alerts</span>
                </DropdownItem>
              </Dropdown>
            </li>
            {/* <!-- Profile menu --> */}
            <li className="relative">
              <button
                className="rounded-full focus:shadow-outline-primary focus:outline-none"
                onClick={handleProfileClick}
                aria-label="Account"
                aria-haspopup="true"
              >
                <Avatar
                  className="align-middle"
                  src="https://images.unsplash.com/photo-1502378735452-bc7d86632805?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&s=aa3a807e1bbdfd4364d1f449eaa96d82"
                  alt=""
                  aria-hidden="true"
                />
              </button>
              <Dropdown
                align="right"
                isOpen={isProfileMenuOpen}
                onClose={() => setIsProfileMenuOpen(false)}
              >
                <DropdownItem tag="a" href="#">
                  <OutlinePersonIcon
                    className="w-4 h-4 mr-3"
                    aria-hidden="true"
                  />
                  <span>Profile</span>
                </DropdownItem>
                <DropdownItem tag="a" href="#">
                  <OutlineCogIcon className="w-4 h-4 mr-3" aria-hidden="true" />
                  <span>Settings</span>
                </DropdownItem>
                <DropdownItem onClick={() => alert("Log out!")}>
                  <OutlineLogoutIcon
                    className="w-4 h-4 mr-3"
                    aria-hidden="true"
                  />
                  <span>Log out</span>
                </DropdownItem>
              </Dropdown>
            </li>
          </ul>
        </div>
      </header>
      <div className="fixed w-2/3 pt-4 mt-20 bg-transparent bg-white ml-72">
        {/* <HeaderCards /> */}
      </div>
    </>
  );
}

export default Header;
