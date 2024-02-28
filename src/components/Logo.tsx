import { ColorProps, LayoutProps } from 'styled-system';
import { Icon } from '@/shared/components/';
import { Theme } from '@/shared/theme';
import cn from 'classnames';

type LogoProps = {
    className?: string;
} & ColorProps<Theme> &
    LayoutProps<Theme>;

export const Logo = ({ className, ...rest }: LogoProps) => {
    return <Icon className={cn(className, 'w-[147px] h-4.5')} icon='logo' {...rest} />;
};

export const LogoIcon = ({ className, ...rest }: LogoProps) => {
    return <Icon className={cn(className, 'w-6 h-6')} icon='logo-inverted' {...rest} />;
};
