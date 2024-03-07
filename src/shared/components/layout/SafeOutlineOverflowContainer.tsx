import { ComponentProps } from 'react';
import cn from 'classnames';

interface Props extends ComponentProps<'div'> {
    className?: string;
}

const SafeOutlineOverflowContainer = ({ className, ...rest }: Props): JSX.Element => {
    return <div className={cn('px-0.5 -mx-0.5 overflow-hidden', className)} {...rest} />;
};

export default SafeOutlineOverflowContainer;
