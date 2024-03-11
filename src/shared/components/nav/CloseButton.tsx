import { useNavigate } from 'react-router-dom';
import { Icon } from '../icon';
import { NavButton } from './NavButton';

export const CloseButton = () => {
    const navigate = useNavigate();

    const handleNavigate = () => {
        navigate('/');
    };

    return (
        <NavButton onClick={handleNavigate}>
            <Icon icon='x' className='h-4.5 w-4.5 text-light-black dark:text-white' />
        </NavButton>
    );
};
