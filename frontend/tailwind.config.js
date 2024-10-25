/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{html,js,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        darkTheme: {
          background: '#1D1D42',
          primary: '#4E2ECF',
          success: '#6FCF97',
          text: '#FFFFFF',
        },
        lightTheme: {
          background: '#145858',
          primary: '#C8E0CA',
          accent: '#F7B318',
          text: '#FFFFFF',
        },
      },
    },
  },
  plugins: [],
};
