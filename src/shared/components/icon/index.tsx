import { IconDefinition, IconSvg } from './index.generated';
import cn from 'classnames';
export * from './index.generated';

type IconProps = {
    icon: IconDefinition;
    className?: string;
};

export const Icon: React.FC<IconProps> = ({ icon, className, ...rest }) => {
    return (
        <span {...rest} className={cn('block', 'Icon ' + (className ? className : ''))} role='img'>
            {IconSvg[icon]}
        </span>
    );
};
