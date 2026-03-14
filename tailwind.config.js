/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'fg': 'var(--fg)',
        'bg': 'var(--bg)',
        'muted': 'var(--muted)',
        'accent': 'var(--accent)',
        'gray-block': 'var(--gray-block)',
        'border': 'var(--border)',
      },
      fontFamily: {
        'pixel': ['"Fusion Pixel 12px Proportional SC"', 'sans-serif'],
      },
      maxWidth: {
        'content': 'var(--maxw)',
      },
      spacing: {
        'toc': 'var(--tocw)',
        'toc-sm': 'var(--tocw-sm)',
        'gap': 'var(--gap)',
      }
    },
  },
  plugins: [],
}
