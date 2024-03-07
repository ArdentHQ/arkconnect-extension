import { ColorProps, LayoutProps } from 'styled-system';
import cn from 'classnames';
import { Icon } from '@/shared/components/';
import { Theme } from '@/shared/theme';

type LogoProps = {
    className?: string;
} & ColorProps<Theme> &
    LayoutProps<Theme>;

export const LogoIcon = ({ className, ...rest }: LogoProps) => {
    return <Icon className={cn(className, 'h-6 w-6')} icon='logo-inverted' {...rest} />;
};
