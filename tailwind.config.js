/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,njk,md,js}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
        serif: ["Merienda", "serif"],
      },
      typography: {
        DEFAULT: {
          css: {
            ul: {
              listStyleType: "disc", // Ensures bullet points show up
            },
            "ul ul": {
              listStyleType: "circle", // Styles for nested lists
            },
            "ul ul ul": {
              listStyleType: "square", // Styles for deeply nested lists
            },
          },
        },
      },
      colors: {
        primary: "#13544E",
        secondary: "#13544E",
        muted: "#E3EBE3",
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    // ...
  ],
};
