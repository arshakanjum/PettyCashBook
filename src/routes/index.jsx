import { lazy } from "react";
const Billing = lazy(() => import("../pages/Billing"));

const Customers = lazy(() => import("../pages/Customers"));
const PettyCashTabs = lazy(() => import("../pages/PettyCashTabs"));

// use lazy for better code splitting, a.k.a. load faster
const Employees = lazy(() => import("../pages/Employees"));
const Page404 = lazy(() => import("../pages/404"));
const Blank = lazy(() => import("../pages/Blank"));
const AMC = lazy(() => import("../pages/AMC"));
// const Cards = lazy(() => import('../pages/Cards'))
// const Charts = lazy(() => import('../pages/Charts'))
// const Buttons = lazy(() => import('../pages/Buttons'))

/**
 * ⚠ These are internal routes!
 * They will be rendered inside the app, using the default `containers/Layout`.
 * If you want to add a route to, let's say, a landing page, you should add
 * it to the `App`'s router, exactly like `Login`, `CreateAccount` and other pages
 * are routed.
 *
 * If you're looking for the links rendered in the SidebarContent, go to
 * `routes/sidebar.js`
 */
const routes = [
  {
    path: "/invoices", // the url
    component: Billing, // view rendered
  },
  {
    path: "/employees",
    component: Employees,
  },
  {
    path: "/404",
    component: Page404,
  },
  {
    path: "/blank",
    component: Blank,
  },
  {
    path: "/pettycashbook",
    component: PettyCashTabs,
  },
  {
    path: "/amc",
    component: AMC,
  },
  {
    path: "/customers",
    component: Customers,
  },
  // {
  //   path: '/forms',
  //   component: Forms,
  // },
  // {
  //   path: '/cards',
  //   component: Cards,
  // },
  // {
  //   path: '/charts',
  //   component: Charts,
  // },
  // {
  //   path: '/buttons',
  //   component: Buttons,
  // },
];

export default routes;
