import { IconDefinition, IconSvg } from './index.generated';

import cn from 'classnames';
export * from './index.generated';

type IconProps = {
    icon: IconDefinition;
    className?: string;
};

export const Icon = ({ icon, className, ...rest }: IconProps) => {
    return (
        <span {...rest} className={cn('block', className ? className : '')} role='img'>
            {IconSvg[icon]}
        </span>
    );
};
