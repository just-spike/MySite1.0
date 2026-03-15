export const theme = {
  colors: {
    background: {
      primary: 'var(--bg-primary)',
      secondary: 'var(--bg-secondary)',
    },
    text: {
      primary: 'var(--text-primary)',
      secondary: 'var(--text-secondary)',
      onInverse: 'var(--text-on-inverse)',
    },
    border: {
      default: 'var(--border-default)',
    },
    action: {
      primary: {
        bg: 'var(--action-primary-bg)',
        text: 'var(--action-primary-text)',
        hover: 'var(--action-primary-hover)',
      },
      secondary: {
        bg: 'var(--action-secondary-bg)',
        text: 'var(--action-secondary-text)',
        hover: 'var(--action-secondary-hover)',
      },
      danger: {
        bg: 'var(--action-danger-bg)',
        text: 'var(--action-danger-text)',
        hover: 'var(--action-danger-hover)',
      },
      ghost: {
        bg: 'transparent',
        text: 'var(--text-primary)',
        hover: 'var(--bg-secondary)',
      },
    },
  },
  borderRadius: {
    xs: '4px',
    sm: '6px',
    md: '8px',
    lg: '10px',
    xl: '12px',
    full: '999px',
  },
  typography: {
    fontFamily: {
      sans: '"MiSans", system-ui, sans-serif',
      mono: '"JetBrains Mono", monospace',
      pixel: '"Fusion Pixel 12px Proportional SC", monospace',
    },
    scale: {
      display: {
        fontFamily: '"MiSans", system-ui, sans-serif',
        fontWeight: 500,
        fontSize: '96px',
        lineHeight: '1.4',
        letterSpacing: '-0.02em',
      },
      heading: {
        fontFamily: '"MiSans", system-ui, sans-serif',
        fontWeight: 500,
        fontSize: '36px',
        lineHeight: '1.4',
      },
      body: {
        fontFamily: '"Fusion Pixel 12px Proportional SC", monospace',
        fontWeight: 400,
        fontSize: '16px',
        lineHeight: '1.4',
      },
      bodySmall: {
        fontFamily: '"Fusion Pixel 12px Proportional SC", monospace',
        fontWeight: 400,
        fontSize: '14px',
        lineHeight: '1.4',
      },
      caption: {
        fontFamily: '"JetBrains Mono", monospace',
        fontWeight: 400,
        fontSize: '14px',
        lineHeight: '1.5',
      },
    },
  },
};

// CSS Variables to be injected
export const cssVariables = `
  :root {
    --bg-primary: #FFFFFF;
    --bg-secondary: #F5F4F1;
    --text-primary: #141413;
    --text-secondary: #73726C;
    --text-on-inverse: #FFFFFF;
    --border-default: #E6E4DD;
    
    --action-primary-bg: #D93535;
    --action-primary-text: #FFFFFF;
    --action-primary-hover: #B82C2C;
    
    --action-secondary-bg: #E6E4DD;
    --action-secondary-text: #141413;
    --action-secondary-hover: #D8D6CF;
    
    --action-danger-bg: #D93535;
    --action-danger-text: #FFFFFF;
    --action-danger-hover: #B82C2C;
  }

  @media (prefers-color-scheme: dark) {
    :root {
      --bg-primary: #1F1E1D;
      --bg-secondary: #30302E;
      --text-primary: #FFFFFF;
      --text-secondary: #A1A09A;
      --text-on-inverse: #141413;
      --border-default: #454543;
      
      --action-primary-bg: #D93535;
      --action-primary-text: #FFFFFF;
      --action-primary-hover: #E05555;
      
      --action-secondary-bg: #454543;
      --action-secondary-text: #FFFFFF;
      --action-secondary-hover: #595957;
    }
  }
`;
