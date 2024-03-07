import { Icon, IconDefinition } from '@/shared/components';
import * as UIStore from '@/lib/store/ui';

const Toast = ({ type, message }: UIStore.Toast) => {

    return (
        <div className='flex items-center px-2.5 py-2 bg-light-black dark:bg-white rounded-lg mt-2'>
            <Icon icon={type as IconDefinition} className='h-5 w-5' />
            <p className='typeset-body font-normal text-white dark:text-light-black ml-1 w-fit'>
                {message}
            </p>
        </div>
    );
};

export default Toast;
