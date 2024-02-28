import { useNavigate } from 'react-router-dom';
import { Icon } from '../icon';
import { ContainerWithHover } from './ArrowButton';

export const CloseButton = () => {
    const navigate = useNavigate();

    const handleNavigate = () => {
        navigate('/');
    };

    return (
        <ContainerWithHover borderRadius='50' padding='7' onClick={handleNavigate} as='button'>
            <Icon icon='x' className='h-4.5 w-4.5 text-light-black dark:text-white' />
        </ContainerWithHover>
    );
};
