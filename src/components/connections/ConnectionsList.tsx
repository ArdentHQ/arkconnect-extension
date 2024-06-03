import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import cn from 'classnames';
import { useTranslation } from 'react-i18next';
import SubPageLayout from '../settings/SubPageLayout';
import ConnectionLogoImage from './ConnectionLogoImage';
import { DisconnectSessionModal } from '@/components/wallet/DisconnectSessionModal';
import { useAppSelector } from '@/lib/store';
import * as SessionStore from '@/lib/store/session';
import { Button, Icon, Tooltip } from '@/shared/components';
import formatDomain from '@/lib/utils/formatDomain';
import removeWindowInstance from '@/lib/utils/removeWindowInstance';
import trimAddress from '@/lib/utils/trimAddress';
import { useProfileContext } from '@/lib/context/Profile';
import { selectPrimaryWalletId } from '@/lib/store/wallet';
import { isFirefox } from '@/lib/utils/isFirefox';

const ConnectionsList = () => {
    const location = useLocation();
    const sessions = useAppSelector(SessionStore.selectSessions);
    const { profile } = useProfileContext();
    const primaryWalletId = useAppSelector(selectPrimaryWalletId);
    const [sessionsToRemove, setSessionsToRemove] = useState<SessionStore.Session[]>([]);
    const { t } = useTranslation();
    const getWalletName = (walletId: string) => {
        const wallet = profile.wallets().findById(walletId);

        const displayName = wallet.displayName();

        return displayName ? displayName : trimAddress(wallet.address(), 'short');
    };

    const getSessionByUrl = (sessions: SessionStore.Session[]) => {
        return Object.values(sessions).find(
            (session) =>
                session.domain === location.state?.domain && session.walletId === primaryWalletId,
        );
    };

    useEffect(() => {
        // Check whether the view is within a standalone popup,
        // and open removal confirmation modal on initial render.
        const popupSession = getSessionByUrl(Object.values(sessions));

        if (popupSession) {
            setSessionsToRemove([popupSession]);
        }
    }, [location.state, primaryWalletId, sessions]);

    return (
        <SubPageLayout
            title={t('PAGES.CONNECTIONS.CONNECTED_APPS')}
            footer={
                <div className='bg-white p-4 shadow-button-container dark:bg-subtle-black dark:shadow-button-container-dark'>
                    <Button
                        variant='destructiveSecondary'
                        onClick={() => {
                            setSessionsToRemove(Object.values(sessions));
                        }}
                    >
                        {t('ACTION.DISCONNECT_ALL')}
                    </Button>
                </div>
            }
        >
            <div className='mb-2 flex flex-col gap-2'>
                {Object.values(sessions).map((session) => {
                    return (
                        <div
                            className='relative flex min-h-[58px] w-full items-center justify-between gap-3 rounded-2xl bg-white p-3 shadow-light dark:bg-subtle-black'
                            key={session.id}
                        >
                            <div className='flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-theme-secondary-50 dark:bg-black'>
                                <ConnectionLogoImage
                                    appLogo={session.logo}
                                    alt={session.domain}
                                    roundCorners
                                    withBorder
                                    className='h-10 w-10'
                                />
                            </div>

                            <div className='flex flex-1 flex-col justify-between'>
                                <div>
                                    <Tooltip
                                        content={
                                            <span className='truncate'>
                                                {formatDomain(session.domain, false)}
                                            </span>
                                        }
                                        placement='top'
                                    >
                                        <p className='typeset-headline font-medium text-light-black dark:text-white'>
                                            {formatDomain(session.domain, false)}
                                        </p>
                                    </Tooltip>
                                </div>

                                <span className='typeset-body mt-1 text-theme-secondary-500 dark:text-theme-secondary-300'>
                                    {t('PAGES.CONNECTIONS.CONNECTED_WITH')}{' '}
                                    <Tooltip
                                        content={profile
                                            .wallets()
                                            .findById(session.walletId)
                                            .address()}
                                        placement='bottom-start'
                                    >
                                        <strong className='text-theme-secondary-700 underline-offset-2 hover:underline dark:text-theme-secondary-200'>
                                            {trimAddress(getWalletName(session.walletId), 14)}
                                        </strong>
                                    </Tooltip>
                                </span>
                            </div>

                            <Tooltip content={t('ACTION.DISCONNECT')} placement='left'>
                                <button
                                    type='button'
                                    className={cn(
                                        'flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-theme-error-500 hover:bg-theme-secondary-50 dark:text-theme-error-600 dark:hover:bg-theme-secondary-700',
                                        {
                                            'transition-smoothEase': !isFirefox,
                                            'transition-firefoxSmoothEase': isFirefox,
                                        },
                                    )}
                                    onClick={() => {
                                        setSessionsToRemove([session]);
                                    }}
                                >
                                    <Icon
                                        icon='slash'
                                        className='h-4.5 w-4.5 text-theme-error-600 dark:text-theme-error-500'
                                    />
                                </button>
                            </Tooltip>
                        </div>
                    );
                })}
            </div>

            <DisconnectSessionModal
                sessions={sessionsToRemove}
                isOpen={sessionsToRemove.length > 0}
                onCancel={async () => {
                    if (getSessionByUrl(sessionsToRemove)) {
                        await removeWindowInstance(location.state?.windowId, 100);
                    }

                    setSessionsToRemove([]);
                }}
                onConfirm={async () => {
                    if (getSessionByUrl(sessionsToRemove)) {
                        await removeWindowInstance(location.state?.windowId, 100);
                    }

                    setSessionsToRemove([]);
                }}
            />
        </SubPageLayout>
    );
};

export default ConnectionsList;
