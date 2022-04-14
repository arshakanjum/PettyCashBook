/**
 * ⚠ These are used just to render the Sidebar!
 * You can include any link here, local or external.
 *
 * If you're looking to actual Router routes, go to
 * `routes/index.js`
 */
const routes = [
  {
    path: "/app/pettycashbook", // the url
    icon: "MenuIcon", // the component being exported from icons/index.js
    name: "Petty Cashbook", // name that appear in Sidebar
  },
  {
    path: "/app/invoices", // the url
    icon: "HomeIcon", // the component being exported from icons/index.js
    name: "Invoices", // name that appear in Sidebar
  },
  {
    path: "/app/AMC", // the url
    icon: "HomeIcon", // the component being exported from icons/index.js
    name: "Annual Maintanence Contracts", // name that appear in Sidebar
  },
  // {
  //   path: "/app/Cashbook", // the url
  //   icon: "MenuIcon", // the component being exported from icons/index.js
  //   name: "Cashbook", // name that appear in Sidebar
  // },
  // {
  //   path: "/app/Employees", // the url
  //   icon: "PeopleIcon", // the component being exported from icons/index.js
  //   name: "Employees", // name that appear in Sidebar
  // },

  // {
  //   path: '/app/forms',
  //   icon: 'FormsIcon',
  //   name: 'Forms',
  // },
  // {
  //   path: '/app/cards',
  //   icon: 'CardsIcon',
  //   name: 'Cards',
  // },
  // {
  //   path: '/app/charts',
  //   icon: 'ChartsIcon',
  //   name: 'Charts',
  // },
  // {
  //   path: '/app/buttons',
  //   icon: 'ButtonsIcon',
  //   name: 'Buttons',
  // },
  // {
  //   path: '/app/Cashbook',
  //   icon: 'CashbookIcon',
  //   name: 'Cashbook',
  // },
  // {
  //   path: '/app/tables',
  //   icon: 'TablesIcon',
  //   name: 'Tables',
  // },
  // {
  //   icon: 'PagesIcon',
  //   name: 'Pages',
  //   routes: [
  //     // submenu
  //     {
  //       path: '/login',
  //       name: 'Login',
  //     },
  //     {
  //       path: '/create-account',
  //       name: 'Create account',
  //     },
  //     {
  //       path: '/forgot-password',
  //       name: 'Forgot password',
  //     },
  //     {
  //       path: '/app/404',
  //       name: '404',
  //     },
  //     {
  //       path: '/app/blank',
  //       name: 'Blank',
  //     },
  //   ],
  // },
];

export default routes;
