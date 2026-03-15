# Design System

This directory contains the design system components generated from Figma.

## Structure

- `theme.js`: Defines the design tokens (colors, spacing, radius) and CSS variables.
- `components/`: Reusable UI components (Button, Input, Icons).
- `index.jsx`: A preview dashboard showing the design system in action.
- `assets/`: Raw assets like SVGs downloaded from Figma.

## Usage

1. **Importing the Theme**:
   Import `cssVariables` from `theme.js` and inject it into your app's root (or use the `DesignSystemPreview` component which does this automatically).

2. **Using Components**:
   ```jsx
   import Button from './DesignSystem/components/Button';
   import { AddIcon } from './DesignSystem/components/Icons';

   <Button variant="primary" startIcon={<AddIcon />}>
     Click Me
   </Button>
   ```

## Figma Source
Generated from: https://www.figma.com/design/4UeHwuFUXx3MydMW5bqvOs/MCP-Apps-for-Claude--Community-
