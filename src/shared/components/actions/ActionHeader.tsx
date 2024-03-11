import cn from 'classnames';
import RequestedBy from './RequestedBy';
import { HeadingTODO, Icon, IconDefinition } from '@/shared/components';

type Props = {
    appLogo?: string;
    appDomain: string;
    icon: IconDefinition;
    actionLabel: string;
    iconClassNames?: string;
};

const ActionHeader = ({ appDomain, appLogo, icon, actionLabel, iconClassNames }: Props) => {
    return (
        <div className='mb-6 flex flex-col items-center gap-6'>
            <RequestedBy appDomain={appDomain} appLogo={appLogo} />

            <div className='flex flex-col items-center gap-3 px-4'>
                <div className='flex h-14 w-14 items-center justify-center rounded-2xl border border-solid border-theme-primary-300 bg-theme-primary-100 dark:border-theme-primary-800 dark:bg-theme-primary-650/15'>
                    <Icon
                        icon={icon}
                        className={cn(
                            'h-8 w-8 text-theme-primary-700 dark:text-theme-primary-600',
                            iconClassNames,
                        )}
                    />
                </div>

                <HeadingTODO level={3}>{actionLabel}</HeadingTODO>
            </div>
        </div>
    );
};

export default ActionHeader;
