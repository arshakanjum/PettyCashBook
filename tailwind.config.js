const defaultTheme = require("tailwindcss/defaultTheme");
const windmill = require("@windmill/react-ui/config");
const plugin = require("tailwindcss/plugin");
var conf = {
  // mode: "jit",
  content: [
    "./src/*.js",
    "./src/**/*.js",
    "./*.js",
    "./node_modules/@windmill/react-ui/dist/*.js",
    "./node_modules/@windmill/react-ui/lib/*.js",
  ],
  purge: [
    "./src/*.js",
    "./src/**/*.js",
    "./*.js",
    "./node_modules/@windmill/react-ui/dist/*.js",
    "./node_modules/@windmill/react-ui/lib/*.js",
  ],
  corePlugins: {
    aspectRatio: false,
  },
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", ...defaultTheme.fontFamily.sans],
      },
      boxShadow: {
        bottom:
          "0 5px 6px -7px rgba(0, 0, 0, 0.6), 0 2px 4px -5px rgba(0, 0, 0, 0.06)",
      },
      borderWidth: {
        DEFAULT: "1px",
        0: "0",
        2: "2px",
        3: "3px",
        4: "4px",
        6: "6px",
        8: "8px",
      },
      aspectRatio: {
        210: "210",
        297: "297",
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/aspect-ratio"),
    require("tailwind-scrollbar"),
    require("flowbite/plugin"),
    require("@tailwindcss/typography"),
    require("daisyui"),
  ],
  // daisyui: {
  //   styled: true,
  //   themes: true,
  //   base: true,
  //   utils: true,
  //   logs: true,
  //   rtl: false,
  //   prefix: "",
  //   darkTheme: "dark",
  // },
};

module.exports = {
  ...windmill(conf),
  ...conf,
};
