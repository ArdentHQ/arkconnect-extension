import cn from 'classnames';

type Props = {
    step: number;
    disabled?: boolean;
};

const Step = ({ step, disabled = false }: Props) => {
    return (
        <div className='bg-theme-primary-50 dark:bg-theme-secondary-600 flex min-h-6 min-w-6 items-center justify-center rounded-[44px]'>
            <p
                className={cn('typeset-body text-theme-primary-700 font-medium', {
                    'dark:text-theme-primary-650': !disabled,
                })}
            >
                {step}
            </p>
        </div>
    );
};

export default Step;
