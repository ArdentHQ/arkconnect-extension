import { Icon, IconDefinition } from '@/shared/components';
import * as UIStore from '@/lib/store/ui';

const Toast = ({ type, message }: UIStore.Toast) => {
    return (
        <div className='bg-light-black mt-2 flex items-center rounded-lg px-2.5 py-2 dark:bg-white'>
            <Icon icon={type as IconDefinition} className='h-5 w-5' />
            <p className='typeset-body dark:text-light-black ml-1 w-fit font-normal text-white'>
                {message}
            </p>
        </div>
    );
};

export default Toast;
