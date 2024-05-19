import BigNumber from 'bignumber.js';
import { Icon, Input } from '@/shared/components';

interface InputProperties extends React.InputHTMLAttributes<HTMLInputElement> {
  visible?: boolean;
  step?: number;
  onValueChange: (value: string) => void;
  variant?: 'primary' | 'destructive';
  value: string;
  helperText?: string;
}

const ArrowButtons = ({value, step, onValueChange}: {value: string, step: number, onValueChange: (value: string) => void;}) => {
    return (
        <div className='flex flex-col'>
            <button className='h-5 w-7 rounded hover:bg-theme-secondary-50 text-light-black flex items-center justify-center transition-smoothEase' onClick={() => {
                const nextValue = new BigNumber(
                    value || 0,
                  ).plus(step);
    
                  const formatted = Number(nextValue.toString()).toFixed(8);
    
                  onValueChange(new BigNumber(formatted).toFixed());
            }}>
                <Icon icon='arrow-down' className='h-5 w-5 rotate-180' />
            </button>
            <button className='h-5 w-7 rounded hover:bg-theme-secondary-50 text-light-black flex items-center justify-center transition-smoothEase' onClick={() => {
                const nextValue = new BigNumber(
                    value || 0,
                  ).minus(step);
    
                  const formatted = Number(nextValue.toString()).toFixed(8);
    
                  onValueChange(new BigNumber(formatted).toFixed());
            }}>
                <Icon icon='arrow-down' className='h-5 w-5' />
            </button>
        </div>
    );
};

export const NumericInput = ({
  step = 0.01,
  onValueChange,
  variant,
  value,
  helperText,
  ...properties
}: InputProperties) => {

  return (
    <>
        <Input
          type="text"
          step={step}
          variant={variant}
          value={value}
          helperText={helperText}
          trailing={<ArrowButtons value={value} step={step} onValueChange={onValueChange} />}
          {...properties}
        />
    </>
  );
};
