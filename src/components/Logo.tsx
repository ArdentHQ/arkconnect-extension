import { twMerge } from 'tailwind-merge';
import { Icon } from '@/shared/components/';

type LogoProps = {
    className?: string;
};

export const LogoIcon = ({ className }: LogoProps) => {
    return <Icon className={twMerge(className, 'h-6 w-6')} icon='logo-inverted' />;
};
