import React, { createContext, useContext } from 'react';
import cn from 'classnames';
import { Input } from './input/Input';
import { Button } from './button/Button';
import AmountComponent from '@/components/wallet/Amount';

export interface OptionProperties {
    label: string;
    value: string | number;
    isSelected?: boolean;
}

type SwitchOption = { label: string; value: string | number };
export const Switch = ({
    value,
    onChange,
    leftOption,
    rightOption,
    disabled,
}: {
    value: string | number;
    onChange: (value: any) => void;
    leftOption: SwitchOption;
    rightOption: SwitchOption;
    disabled?: boolean;
    size?: 'sm' | 'md';
}) => (
    <div className='inline-flex overflow-hidden rounded-md border border-theme-secondary-300'>
        {[leftOption, rightOption].map((option) => (
            <button
                key={option.value}
                type='button'
                disabled={disabled}
                onClick={() => onChange(option.value)}
                className={cn('px-2 py-1 text-xs', {
                    'bg-theme-primary-500 text-white': value === option.value,
                })}
            >
                {option.label}
            </button>
        ))}
    </div>
);

type FormFieldContextState = { name?: string; isInvalid?: boolean };
const FormFieldContext = createContext<FormFieldContextState>({});
export const useFormField = () => useContext(FormFieldContext);

export const FormField = ({ name, children }: { name?: string; children: React.ReactNode }) => (
    <FormFieldContext.Provider value={{ isInvalid: false, name }}>
        <div className='flex min-w-0 flex-col'>{children}</div>
    </FormFieldContext.Provider>
);

export const FormLabel = ({ label, className }: { label: React.ReactNode; className?: string; id?: string }) => (
    <label data-testid='FormLabel' className={className}>
        {label}
    </label>
);

export const InputCurrency = ({
    value,
    onChange,
    disabled,
    addons,
}: {
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
    addons?: { end?: { content?: React.ReactNode; wrapperClassName?: string } };
    [key: string]: any;
}) => (
    <Input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
        trailing={addons?.end?.content}
    />
);

export const Amount = AmountComponent;

export const ButtonGroup = ({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) => <div className={className}>{children}</div>;

export const ButtonGroupOption = ({
    children,
    setSelectedValue,
    className,
}: {
    children: React.ReactNode;
    setSelectedValue: () => void;
    className?: string;
    [key: string]: any;
}) => (
    <button type='button' onClick={setSelectedValue} className={className}>
        {children}
    </button>
);

export const SmAndBelow = ({ children }: { children: React.ReactNode }) => (
    <div className='md:hidden'>{children}</div>
);
export const MdAndAbove = ({ children }: { children: React.ReactNode }) => (
    <div className='hidden md:block'>{children}</div>
);

export const Toast = ({
    children,
    variant,
}: {
    children: React.ReactNode;
    variant?: 'success' | 'warning' | 'danger' | 'info';
}) => (
    <div className={cn('rounded-lg border p-3', { 'border-theme-error-500': variant === 'danger' })}>
        {children}
    </div>
);
