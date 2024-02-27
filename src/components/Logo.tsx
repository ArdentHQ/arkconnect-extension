import { ColorProps, LayoutProps } from 'styled-system';
import { Icon } from '@/shared/components/';
import { Theme } from '@/shared/theme';

type LogoProps = {
    className?: string;
} & ColorProps<Theme> &
    LayoutProps<Theme>;

export const Logo = ({ className, ...rest }: LogoProps) => {
    return <Icon className={className} width='147px' height='18px' icon='logo' {...rest} />;
};

export const LogoIcon = ({ className, ...rest }: LogoProps) => {
    return <Icon className={className} width='24px' height='24px' icon='logo-inverted' {...rest} />;
};
