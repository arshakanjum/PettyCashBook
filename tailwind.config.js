const defaultTheme = require("tailwindcss/defaultTheme");
const plugin = require("tailwindcss/plugin");
const src = require("tailwind-scrollbar");
module.exports = {
  mode: "jit",
  content: ["./src/**/*.{html,js, jsx}"],
  purge: {
    // classes that are generated dynamically, e.g. `rounded-${size}` and must
    // be kept
    content: [
      "./index.html",
      "./src/**/*.{jsx,js,ts}",
      // etc.
    ],
  },
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
      screens: {
        print: { raw: "print" },
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
    require("@benface/tailwindcss-reset"),
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
