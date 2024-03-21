import { useNavigate } from 'react-router-dom';
import cn from 'classnames';
import { NavButton } from './NavButton';
import { Icon } from '@/shared/components';

export const ArrowButton = ({
    action = 'goBack',
    disabled = false,
    onClick,
}: {
    action?: 'goBack' | 'goHome';
    disabled?: boolean;
    onClick?: () => void;
}) => {
    const navigate = useNavigate();

    const handleNavigate = () => {
        if (disabled) return;

        if (onClick) {
            onClick();
            return;
        }

        if (action === 'goBack') {
            navigate(-1);
        } else {
            navigate('/');
        }
    };

    return (
        <NavButton onClick={handleNavigate} disabled={disabled}>
            <Icon
                icon='arrow-left'
                className={cn('h-4.5 w-4.5', {
                    'text-theme-secondary-200 dark:text-theme-secondary-500': disabled,
                    'text-light-black dark:text-white': !disabled,
                })}
            />
        </NavButton>
    );
};
