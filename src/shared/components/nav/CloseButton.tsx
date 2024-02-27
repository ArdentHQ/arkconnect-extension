import { useNavigate } from 'react-router-dom';
import { Icon } from '../icon';
import { ContainerWithHover } from './ArrowButton';

export const CloseButton = () => {
    const navigate = useNavigate();

    const handleNavigate = () => {
        navigate('/');
    };

    return (
        <ContainerWithHover
            borderRadius='50'
            padding='7'
            onClick={handleNavigate}
            as='button'
        >
            <Icon icon='x' width='18px' height='18px' color='base' />
        </ContainerWithHover>
    );
};
