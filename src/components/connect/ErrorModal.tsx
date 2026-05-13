import { Trans, useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import cn from 'classnames';
import { Button, ExternalLink, Heading, Icon, SmallWarningIcon } from '@/shared/components';
import constants from '@/constants';
import { errorParser, errorTitleParser } from '@/lib/utils/errorParser';
import useClipboard from '@/lib/hooks/useClipboard';

type Props = {
    error: string | null;
    onClose: () => Promise<void>;
    onBack: () => void;
};

const ErrorContainer = ({ error }: { error: string }) => {
    const { t } = useTranslation();
    const { copy } = useClipboard();

    const handleClick = () => {
        copy(error, t('COMMON.ERROR'));
    };

    return (
        <div className='flex flex-col gap-4'>
            <div className='border-theme-secondary-400 text-light-black dark:border-theme-secondary-500 dark:bg-subtle-black dark:shadow-secondary-dark flex items-start justify-start rounded-lg border bg-white p-3 text-left text-base leading-5 font-normal break-all dark:text-white'>
                <span className='block' dangerouslySetInnerHTML={{ __html: errorParser(error) }} />
            </div>

            <div className='flex w-full justify-center'>
                <button
                    className='transition-smoothEase text-light-black hover:bg-theme-secondary-50 dark:text-theme-secondary-200 hover:dark:bg-theme-secondary-700 flex w-fit cursor-pointer flex-row items-center justify-center gap-3 rounded-2xl bg-transparent px-4 py-1.5 text-base leading-5 font-medium'
                    onClick={handleClick}
                >
                    <Icon icon='copy' className='h-4 w-4' />
                    {t('COMMON.COPY_with_name', { name: t('COMMON.ERROR') })}
                </button>
            </div>
        </div>
    );
};

const ErrorModal = ({ error, onClose, onBack }: Props) => {
    const { t } = useTranslation();
    const location = useLocation();
    const { state } = location;

    const isNativeError = state?.session?.domain
        ? state.session.domain === constants.APP_NAME
        : false;

    return (
        <div className='bg-subtle-white dark:bg-light-black fixed top-0 left-0 z-50 flex h-screen w-full flex-col'>
            <div className='flex w-full flex-1 flex-col items-center justify-between gap-4 px-4'>
                <div className='flex h-full w-full flex-col items-center justify-center gap-4'>
                    <SmallWarningIcon />

                    <div className='flex w-full flex-col gap-4'>
                        <Heading level={3} className='mb-2 text-center'>
                            {errorTitleParser(error)}
                        </Heading>

                        <div className='text-theme-secondary-500 dark:text-theme-secondary-300 text-center break-words'>
                            {error ? (
                                <ErrorContainer error={error} />
                            ) : (
                                <Trans i18nKey='MISC.UNKNOWN_CONNECTION_ERROR' />
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className='shadow-button-container dark:bg-subtle-black dark:shadow-button-container-dark flex w-full flex-none flex-col items-center gap-5 bg-white p-4'>
                <div
                    className={cn('grid w-full', {
                        'grid-cols-1': !isNativeError,
                        'grid-cols-2 gap-2': isNativeError,
                    })}
                >
                    <Button variant='secondary' onClick={onClose}>
                        {t('ACTION.CLOSE')}
                    </Button>
                    {isNativeError && (
                        <Button variant='primary' onClick={onBack}>
                            {t('COMMON.BACK')}
                        </Button>
                    )}
                </div>

                <ExternalLink
                    className='text-light-black flex w-full items-center justify-center gap-2 dark:text-white'
                    href={`mailto:${constants.SUPPORT_EMAIL}?subject=${encodeURIComponent(t('MISC.ARK_CONNECT_SUPPORT'))}`}
                >
                    <span className='font-medium'>{t('MISC.REACH_OUT_TO_SUPPORT_TEAM')}</span>

                    <Icon icon='link-external' className='h-5 w-5' />
                </ExternalLink>
            </div>
        </div>
    );
};

export default ErrorModal;
