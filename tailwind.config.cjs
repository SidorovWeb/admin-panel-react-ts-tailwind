/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './node_modules/tw-elements/dist/js/**/*.js'],
  darkMode: 'class',
  theme: {
    extend: {},
    container: {
      padding: '20px',
      center: true,
    },
  },
  plugins: [require('tw-elements/dist/plugin')],
}
