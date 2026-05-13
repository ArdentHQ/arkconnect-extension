import { useNavigate } from 'react-router-dom';
import { NavButton } from './NavButton';
import { Icon } from '@/shared/components/icon';

export const CloseButton = () => {
    const navigate = useNavigate();

    const handleNavigate = () => {
        navigate('/');
    };

    return (
        <NavButton onClick={handleNavigate}>
            <Icon icon='x' className='text-light-black h-4.5 w-4.5 dark:text-white' />
        </NavButton>
    );
};
