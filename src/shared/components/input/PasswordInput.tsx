import { useState } from 'react';
import cn from 'classnames';
import { Icon, Input } from '@/shared/components';
import { isFirefox } from '@/lib/utils/isFirefox';

type Props = React.ComponentProps<typeof Input> & {
    labelText?: string;
};

const EyeButton = ({ showPassword, onClick }: { showPassword: boolean; onClick: () => void }) => {
    return (
        <button
            className={cn(
                'text-light-black flex h-7 w-7 cursor-pointer items-center justify-center rounded-full dark:text-white',
                {
                    'focus-visible:outline focus-visible:outline-2': isFirefox,
                },
            )}
            onClick={onClick}
        >
            <Icon
                className='text-light-black h-5 w-5 dark:text-white'
                icon={showPassword ? 'eye-off' : 'eye'}
            />
        </button>
    );
};

export const PasswordInput = ({ labelText, ...props }: Props) => {
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className='text-light-black relative dark:text-white'>
            <Input
                type={showPassword ? 'text' : 'password'}
                labelText={labelText}
                {...props}
                className='pr-10'
                trailing={<EyeButton showPassword={showPassword} onClick={toggleShowPassword} />}
            />
        </div>
    );
};
