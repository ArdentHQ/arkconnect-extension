import { ComponentProps } from 'react';
import { twMerge } from 'tailwind-merge';

interface Props extends ComponentProps<'div'> {
    className?: string;
}

const SafeOutlineOverflowContainer = ({ className, ...rest }: Props): JSX.Element => {
    return <div className={twMerge('-mx-0.5 overflow-hidden', className)} {...rest} />;
};

export default SafeOutlineOverflowContainer;
