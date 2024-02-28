/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        light: {
          100: '#E9E9E9',
          200: '#F8F8F8'
        },
        dark: {
          100: '#1B1B3B',
          200: '#0B0B2B',
          300: '#3B3B5B'
        },
        danger: '#F91444',
        turquoise: '#7fffd4',
        skyblue: 'rgb(92, 252, 255)',
        skyviolet: 'rgb(138, 66, 255)'
      },
      dropShadow: {
        skyblue: '0 0 5px rgb(92, 252, 255)',
        skyviolet: '0px 0px 5px rgb(138, 66, 255)'
      },
      boxShadow: {
        skyBlueViolet:
          '-3px -3px 5px rgb(92, 252, 255),3px 3px 5px rgb(138, 66, 255)',
        skyviolet:
          '0px 0px 5px rgb(138, 66, 255),0px 0px 5px rgb(138, 66, 255)',
        skyblue: '0 0 5px rgb(92, 252, 255),0 0 5px rgb(92, 252, 255)'
      }
    }
  },
  plugins: []
}
