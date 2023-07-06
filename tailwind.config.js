/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
      extend: {
        screens: {
          xs: "320px",
          sm: "375px",
          sml: "500px",
          md: "667px",
          mdl: "678px",
          lg: "960px",
          lgl: "1024px",
          xl: "1280px",
  
  
        },
        colors: {
          background: "#111111",
          backgroundGra: "#232323",
          secondaryBackground: "#343434",
          secondaryGra: "#464646",
          textYellow: "#EE6C4D", 
          textLight: "#98C1D9", 
          textDark: "#3D5A80",
          hoverColor: "#E0FBFC",
        }
      },
    },
  plugins: [],
}

