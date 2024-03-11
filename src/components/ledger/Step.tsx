import classNames from 'classnames';

type Props = {
    step: number;
    disabled?: boolean;
};

const Step = ({ step, disabled = false }: Props) => {
    return (
        <div className='flex min-h-6 min-w-6 items-center justify-center rounded-[44px] bg-theme-primary-50 dark:bg-theme-secondary-600'>
            <p
                className={classNames(
                    'typeset-body dark:text-theme-secondary-650 font-medium text-theme-primary-700',
                    {
                        'dark:text-theme-secondary-650 text-theme-primary-700': !disabled,
                        'text-theme-primary-700': disabled,
                    },
                )}
            >
                {step}
            </p>
        </div>
    );
};

export default Step;
