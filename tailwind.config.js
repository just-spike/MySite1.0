/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./DesignSystem/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    {
      pattern: /(bg|text|border|ring)-/,
    }
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
        // Semantic Tokens from Figma
        'btn-default-bg': '#141413',
        'btn-default-text': '#FFFFFF',
        'btn-default-hover': '#2C2C2A',
        'btn-danger-bg': '#B53333',
        'btn-danger-text': '#FFFFFF',
        'btn-danger-hover': '#D93D3D',
        'btn-border': 'rgba(31, 30, 29, 0.4)',
        'btn-secondary-bg': '#FFFFFF',
        'btn-secondary-text': '#141413',
        'btn-secondary-hover': '#f9fafb', // gray-50 equivalent
      },
      fontFamily: {
        'pixel': ['"Fusion Pixel 12px Proportional SC"', 'monospace'],
        'sans': ['MiSans', 'system-ui', 'sans-serif'],
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
