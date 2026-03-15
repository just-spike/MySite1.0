import React from 'react';
import PropTypes from 'prop-types';
import { cva } from 'class-variance-authority';
import { cn } from '../../src/lib/utils';

/**
 * Figma Source: https://www.figma.com/design/4UeHwuFUXx3MydMW5bqvOs/MCP-Apps-for-Claude--Community-?node-id=467-23758
 * 
 * Implemented using CVA (Class Variance Authority) for better type safety and Tailwind integration.
 * Uses semantic tokens defined in tailwind.config.js instead of arbitrary values.
 */

const buttonVariants = cva(
  "box-border flex flex-row justify-center items-center font-['Fusion_Pixel_10px_Mono_ja'] text-[14px] leading-[20px] font-normal text-center transition-all duration-200 cursor-pointer focus:outline-none",
  {
    variants: {
      variant: {
        Default: "bg-btn-default-bg text-btn-default-text hover:bg-btn-default-hover",
        Secondary: "bg-btn-secondary-bg border-[0.5px] border-btn-border text-btn-secondary-text hover:bg-btn-secondary-hover",
        Danger: "bg-btn-danger-bg text-btn-danger-text hover:bg-btn-danger-hover",
      },
      size: {
        Default: "h-[36px] px-[16px] rounded-[8px]",
        Small: "h-[32px] px-[12px] rounded-[6px]",
      },
      state: {
        Default: "",
        Focused: "", // Focus styles are handled by compound variants below
        Disabled: "opacity-50 cursor-not-allowed pointer-events-none",
      },
    },
    compoundVariants: [
      // Focus States - using Tailwind arbitrary values for complex shadows (as they are specific to this component)
      // or we could add these shadows to tailwind.config.js theme.boxShadow
      {
        variant: "Default",
        state: "Focused",
        class: "shadow-[0px_0px_0px_2px_#FFFFFF,0px_0px_0px_3.5px_rgba(20,20,19,0.7)]"
      },
      {
        variant: "Secondary",
        state: "Focused",
        class: "shadow-[0px_0px_0px_2px_#FFFFFF,0px_0px_0px_3.5px_rgba(50,102,173,0.5)]"
      },
      {
        variant: "Danger",
        state: "Focused",
        class: "shadow-[0px_0px_0px_2px_#FFFFFF,0px_0px_0px_3.5px_rgba(167,61,57,0.5)]"
      },
      // Danger Disabled specific opacity
      {
        variant: "Danger",
        state: "Disabled",
        class: "opacity-60" // Overrides the default opacity-50
      }
    ],
    defaultVariants: {
      variant: "Default",
      size: "Default",
      state: "Default",
    },
  }
);

const Button = ({
  variant,
  size,
  state,
  label = 'Button',
  onClick,
  className,
  ...props
}) => {
  return (
    <button
      className={cn(buttonVariants({ variant, size, state, className }))}
      onClick={state === 'Disabled' ? undefined : onClick}
      disabled={state === 'Disabled'}
      {...props}
    >
      {label}
    </button>
  );
};

Button.propTypes = {
  variant: PropTypes.oneOf(['Default', 'Secondary', 'Danger']),
  size: PropTypes.oneOf(['Default', 'Small']),
  state: PropTypes.oneOf(['Default', 'Disabled', 'Focused']),
  label: PropTypes.string,
  onClick: PropTypes.func,
  className: PropTypes.string,
};

export default Button;
