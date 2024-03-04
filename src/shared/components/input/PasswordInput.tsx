import { useState } from 'react';
import cn from 'classnames';
import { Icon, Input } from '@/shared/components';
import { isFirefox } from '@/lib/utils/isFirefox';

type Props = React.ComponentProps<typeof Input> & {
    labelText?: string;
};

const EyeButton = ({
    showPassword,
    onClick,
    labelText,
}: {
    showPassword: boolean;
    onClick: () => void;
    labelText?: string;
}) => {
    return (
        <button 
            className={cn('flex cursor-pointer text-light-black dark:text-white w-7 h-7 rounded-full justify-center items-center', {
                'focus-visible:outline focus-visible:outline-2': isFirefox,
                'top-9': labelText,
                'top-3': !labelText,
            })}
            onClick={onClick}
        >
            <Icon
                className='h-5 w-5 text-light-black dark:text-white'
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
        <div className='relative text-light-black dark:text-white'>
            <Input
                type={showPassword ? 'text' : 'password'}
                labelText={labelText}
                {...props}
                inputClassNames='pr-10'
                trailing={
                    <EyeButton
                        showPassword={showPassword}
                        onClick={toggleShowPassword}
                        labelText={labelText}
                    />
                }
            />
        </div>
    );
};