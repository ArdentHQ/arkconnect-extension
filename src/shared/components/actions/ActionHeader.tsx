import { twMerge } from 'tailwind-merge';
import { Heading, Icon, IconDefinition } from '@/shared/components';

type Props = {
    icon: IconDefinition;
    actionLabel: string;
    iconClassNames?: string;
};

const ActionHeader = ({ icon, actionLabel, iconClassNames }: Props) => {
    return (
        <div className='mb-4 flex flex-col items-center gap-6'>
            <div className='flex flex-row items-center justify-center gap-3'>
                <div className='flex items-center justify-center rounded-lg border border-solid border-theme-primary-300 bg-theme-primary-100 p-1 dark:border-theme-primary-800 dark:bg-theme-primary-650/15'>
                    <Icon
                        icon={icon}
                        className={twMerge(
                            'h-4 w-4 text-theme-primary-700 dark:text-theme-primary-600',
                            iconClassNames,
                        )}
                    />
                </div>

                <Heading level={3}>{actionLabel}</Heading>
            </div>
        </div>
    );
};

export default ActionHeader;
