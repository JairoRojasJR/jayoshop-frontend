/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  // darkMode: 'class',
  theme: {
    extend: {
      colors: {
        light: {
          100: '#E9E9E9',
          200: '#F8F8F8',
          300: '#C9C9C9',
          forBlur: '#F8F8F8E3'
        },
        dark: {
          100: '#1B1B3B',
          200: '#0B0B2B',
          300: '#3B3B5B',
          forBlur: '#0B0B2BE3'
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
  plugins: [
    function ({ addVariant }) {
      addVariant('any-hover', '@media (any-hover: hover) { &:hover }')
    }
  ]
}
