/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#0f172a',
          light: '#1e293b',
        },
        side: {
          right: '#10b981', // vert pour côté droit
          left: '#3b82f6',  // bleu pour côté gauche
          rest: '#f59e0b',  // orange pour repos
        },
      },
      fontFamily: {
        display: ['system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
