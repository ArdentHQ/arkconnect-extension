import { Icon, IconDefinition } from '@/shared/components';
import * as UIStore from '@/lib/store/ui';

const Toast = ({ type, message }: UIStore.Toast) => {
    return (
        <div className='mt-2 flex items-center rounded-lg bg-light-black px-2.5 py-2 dark:bg-white'>
            <Icon icon={type as IconDefinition} className='h-5 w-5' />
            <p className='typeset-body ml-1 w-fit font-normal text-white dark:text-light-black'>
                {message}
            </p>
        </div>
    );
};

export default Toast;
