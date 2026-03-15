import React from 'react';
import PropTypes from 'prop-types';
import { cva } from 'class-variance-authority';
import { cn } from '../../src/lib/utils';

const iconButtonVariants = cva(
  'inline-flex items-center justify-center transition-all duration-200 focus:outline-none',
  {
    variants: {
      variant: {
        Default: 'bg-btn-default-bg text-btn-default-text hover:bg-btn-default-hover',
        Secondary: 'bg-btn-secondary-bg border-[0.5px] border-btn-border text-btn-secondary-text hover:bg-btn-secondary-hover',
        Danger: 'bg-btn-danger-bg text-btn-danger-text hover:bg-btn-danger-hover',
        Ghost: 'bg-transparent text-btn-secondary-text hover:bg-btn-secondary-hover',
      },
      size: {
        Default: 'h-[36px] w-[36px] rounded-[8px]',
        Small: 'h-[32px] w-[32px] rounded-[6px]',
      },
      state: {
        Default: '',
        Focused: '',
        Disabled: 'opacity-50 pointer-events-none',
      },
    },
    compoundVariants: [
      {
        variant: 'Default',
        state: 'Focused',
        class: 'shadow-[0px_0px_0px_2px_#FFFFFF,0px_0px_0px_3.5px_rgba(20,20,19,0.7)]',
      },
      {
        variant: 'Secondary',
        state: 'Focused',
        class: 'shadow-[0px_0px_0px_2px_#FFFFFF,0px_0px_0px_3.5px_rgba(50,102,173,0.5)]',
      },
      {
        variant: 'Danger',
        state: 'Focused',
        class: 'shadow-[0px_0px_0px_2px_#FFFFFF,0px_0px_0px_3.5px_rgba(167,61,57,0.5)]',
      },
      {
        variant: 'Danger',
        state: 'Disabled',
        class: 'opacity-60',
      },
    ],
    defaultVariants: {
      variant: 'Default',
      size: 'Default',
      state: 'Default',
    },
  },
);

const IconButton = ({ icon, variant, size, state, className, onClick, ...props }) => {
  return (
    <button
      type="button"
      className={cn(iconButtonVariants({ variant, size, state }), className)}
      onClick={state === 'Disabled' ? undefined : onClick}
      disabled={state === 'Disabled'}
      {...props}
    >
      <span className="h-5 w-5">{icon}</span>
    </button>
  );
};

IconButton.propTypes = {
  icon: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['Default', 'Secondary', 'Danger', 'Ghost']),
  size: PropTypes.oneOf(['Default', 'Small']),
  state: PropTypes.oneOf(['Default', 'Focused', 'Disabled']),
  className: PropTypes.string,
  onClick: PropTypes.func,
};

export default IconButton;
