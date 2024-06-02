import { useLocation } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { runtime, windows } from 'webextension-polyfill';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import ConnectFooter from '@/components/connect/ConnectFooter';
import ConnectWithWallet from '@/components/connect/ConnectWithWallet';
import { useAppDispatch, useAppSelector } from '@/lib/store';
import { Layout } from '@/shared/components';
import * as SessionStore from '@/lib/store/session';
import * as WalletStore from '@/lib/store/wallet';
import { useProfileContext } from '@/lib/context/Profile';
import { selectLocked } from '@/lib/store/ui';
import { assertIsUnlocked } from '@/lib/background/assertions';
import ActionHeader from '@/shared/components/actions/ActionHeader';
import { useNotifyOnUnload } from '@/lib/hooks/useNotifyOnUnload';
import useLoadingModal from '@/lib/hooks/useLoadingModal';
import RequestedBy from '@/shared/components/actions/RequestedBy';

const Connect = () => {
    const location = useLocation();
    const dispatch = useAppDispatch();
    const sessions = useAppSelector(SessionStore.selectSessions);
    const { profile } = useProfileContext();
    const primaryWalletId = useAppSelector(WalletStore.selectPrimaryWalletId);
    const primaryWallet = primaryWalletId ? profile.wallets().findById(primaryWalletId) : undefined;
    const { t } = useTranslation();
    const loadingModal = useLoadingModal({
        completedMessage: t('PAGES.CONNECT.FEEDBACK.SECURELY_CONNECTED'),
        loadingMessage: t('PAGES.CONNECT.FEEDBACK.CONNECTING'),
    });

    const locked = useAppSelector(selectLocked);
    assertIsUnlocked(locked);

    const isAlreadyConnected = useMemo(() => {
        return Object.values(sessions).some((session) => {
            return (
                session.domain === location.state?.domain &&
                session.walletId === primaryWallet?.id()
            );
        });
    }, [sessions]);

    useEffect(() => {
        if (isAlreadyConnected) {
            void onCancel(t('PAGES.CONNECT.FEEDBACK.ALREADY_CONNECTED'));
        }
    }, []);

    const reject = (message = t('PAGES.CONNECT.FEEDBACK.CONNECTION_DENIED')) => {
        runtime.sendMessage({
            type: 'CONNECT_REJECT',
            data: {
                domain: location.state?.domain,
                status: 'failed',
                message,
                tabId: location.state?.tabId,
            },
        });
    };

    const setSubmitted = useNotifyOnUnload(reject);

    const onSubmit = async () => {
        loadingModal.setLoading();

        if (!primaryWallet) {
            reject(t('PAGES.CONNECT.FEEDBACK.WALLET_NOT_FOUND'));
            return;
        }

        if (isAlreadyConnected) {
            reject(t('PAGES.CONNECT.FEEDBACK.ALREADY_CONNECTED'));
            return;
        }

        if (primaryWallet) {
            const sessionId = uuidv4();
            await dispatch(
                SessionStore.sessionAdded({
                    id: sessionId,
                    domain: location.state?.domain,
                    createdAt: new Date().toISOString(),
                    logo: location.state?.favicon,
                    walletId: primaryWallet.id(),
                }),
            );

            await runtime.sendMessage({
                type: 'CONNECT_RESOLVE',
                data: {
                    domain: location.state?.domain,
                    status: 'success',
                    tabId: location.state?.tabId,
                    sessionId: sessionId,
                },
            });

            setSubmitted();

            await windows.remove(location.state?.windowId);
            return;
        }
    };

    const onCancel = async (message?: string) => {
        reject(message);
        await windows.remove(location.state?.windowId);
    };

    return (
        <Layout withHeader={false} className='pb-0'>
            <div className='flex flex-col h-screen'>

                <div className='flex-none'>
                    <RequestedBy 
                        appDomain={location.state?.domain}
                        appLogo={location.state?.favicon}
                    />
                </div>
                <div className="flex-1 overflow-y-auto pt-6">
                    <ActionHeader
                        icon='action-connect'
                        actionLabel={t('PAGES.CONNECT.CONNECT_TO_APP')}
                        iconClassNames='w-[11px] h-4 mx-[2.5px]'
                    />

                    <ConnectWithWallet wallet={primaryWallet} />
                </div>
                <div className='flex-none'>
                    <ConnectFooter onSubmit={onSubmit} onCancel={onCancel} />
                </div>
            </div>
        </Layout>
    );
};

export default Connect;
