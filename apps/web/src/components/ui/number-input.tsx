import { forwardRef } from 'react';
import * as StyledNumberInput from './styled/number-input';

export interface NumberInputProps extends StyledNumberInput.RootProps {}

export const NumberInput = forwardRef<HTMLDivElement, NumberInputProps>((props, ref) => {
  const { children, ...rootProps } = props;
  return (
    <StyledNumberInput.Root ref={ref} {...rootProps}>
      {children && <StyledNumberInput.Label>{children}</StyledNumberInput.Label>}
      <StyledNumberInput.Control>
        <StyledNumberInput.Input />
        <StyledNumberInput.IncrementTrigger>
          <ChevronUpIcon />
        </StyledNumberInput.IncrementTrigger>
        <StyledNumberInput.DecrementTrigger>
          <ChevronDownIcon />
        </StyledNumberInput.DecrementTrigger>
      </StyledNumberInput.Control>
    </StyledNumberInput.Root>
  );
});

NumberInput.displayName = 'NumberInput';

const ChevronUpIcon = () => (
  <svg viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
    <title>Chevron Up Icon</title>
    <path
      d='m18 15l-6-6l-6 6'
      fill='none'
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth='2'
    />
  </svg>
);

const ChevronDownIcon = () => (
  <svg viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
    <title>Chevron Down Icon</title>
    <path
      d='m6 9l6 6l6-6'
      fill='none'
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth='2'
    />
  </svg>
);
