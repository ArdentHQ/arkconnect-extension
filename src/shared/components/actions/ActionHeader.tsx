import { twMerge } from 'tailwind-merge';
import RequestedBy from './RequestedBy';
import { Heading, Icon, IconDefinition } from '@/shared/components';

type Props = {
    appLogo?: string;
    appDomain: string;
    icon: IconDefinition;
    actionLabel: string;
    iconClassNames?: string;
};

const ActionHeader = ({ appDomain, appLogo, icon, actionLabel, iconClassNames }: Props) => {
    return (
        <div className='mb-4 flex flex-col items-center gap-6'>
            <RequestedBy appDomain={appDomain} appLogo={appLogo} />

            <div className='flex flex-row items-center gap-3 justify-center'>
                <div className='flex items-center justify-center rounded-lg border border-solid border-theme-primary-300 bg-theme-primary-100 dark:border-theme-primary-800 dark:bg-theme-primary-650/15 p-1'>
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
