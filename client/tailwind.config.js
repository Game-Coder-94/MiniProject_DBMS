/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'space-dark': '#0f0f1e',
        'space-deeper': '#0a0a14',
        'space-accent': '#8b5cf6',
        'nebula-purple': '#a78bfa',
      },
      backdropBlur: {
        'sm': '4px',
        'md': '12px',
        'lg': '16px',
      },
      backgroundColor: {
        'glass': 'rgba(255, 255, 255, 0.08)',
      },
      borderColor: {
        'glass': 'rgba(255, 255, 255, 0.1)',
      },
    },
  },
  plugins: [],
}
