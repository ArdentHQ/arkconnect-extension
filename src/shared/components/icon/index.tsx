import { twMerge } from 'tailwind-merge';
import { IconDefinition, IconSvg } from './index.generated';

export * from './index.generated';

export type IconProps = {
    icon: IconDefinition;
    className?: string;
};

export const Icon = ({ icon, className, ...rest }: IconProps) => {
    return (
        <span {...rest} className={twMerge('block', className ? className : '')} role='img'>
            {IconSvg[icon]}
        </span>
    );
};
