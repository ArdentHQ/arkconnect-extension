import React from 'react';
import { IconDefinition, IconSvg } from './index.generated';
import cn from 'classnames';
export * from './index.generated';

type IconProps = {
    icon: IconDefinition;
    style?: React.CSSProperties;
    className?: string;
};

export const Icon: React.FC<IconProps> = ({ icon, style, className, ...rest }) => {
    return (
        <span
            {...rest}
            {...{ style }}
            className={cn('block', 'Icon ' + (className ? className : ''))}
            role='img'
        >
            {IconSvg[icon]}
        </span>
    );
};