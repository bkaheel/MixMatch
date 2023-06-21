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
          background: "#FAF0CA",
          secondaryBackground: "#6b705c",
          textYellow: "#F4D35E", 
          textLight: "#EE964B", 
          textDark: "#F95738",
          hoverColor: "#F5CB5C",
        }
      },
    },
  plugins: [],
}

