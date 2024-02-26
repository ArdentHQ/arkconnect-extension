import { useNavigate } from 'react-router-dom';
import { ContainerWithHover } from './ArrowButton';
import { Icon } from '../icon';


export const CloseButton = () => {
    const navigate = useNavigate();

    const handleNavigate = () => {
        navigate('/');
    };

    return (
        <ContainerWithHover borderRadius='50' padding='7' onClick={handleNavigate} as='button' border='none' backgroundColor='transparent'>
            <Icon icon='x' width='18px' height='18px' color='base' />
        </ContainerWithHover>
    );
};
