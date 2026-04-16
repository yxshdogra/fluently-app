/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        jakarta: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      colors: {
        primary: '#8b5cf6',
        'primary-dark': '#6d28d9',
        'primary-light': '#8c30e8',
        'text-primary': '#2c3970',
        'text-body': '#141414',
        'text-muted': 'rgba(44, 57, 112, 0.71)',
        'dot-active': '#1228b1',
      },
      boxShadow: {
        button: '0px 8px 16px 0px rgba(109, 40, 217, 0.25)',
        card: '0px 1px 4px 0px rgba(0, 0, 0, 0.25)',
      },
    },
  },
  plugins: [],
}
