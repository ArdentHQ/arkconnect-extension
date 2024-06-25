import { Trans, useTranslation } from 'react-i18next';
import { Button, ExternalLink, Heading, Icon, SmallWarningIcon } from '@/shared/components';
import constants from '@/constants';
import { errorParser, errorTitleParser } from '@/lib/utils/errorParser';
import useClipboard from '@/lib/hooks/useClipboard';

type Props = {
    error: string | null;
    onClose: () => Promise<void>;
    onBack: () => void;
};

const ErrorContainer = ({ error }: { error: string}) => {
    const { t } = useTranslation();
    const { copy } = useClipboard();
    
    const handleClick = () => {
        copy(error, t('COMMON.ERROR'));
    };

    return (
        <div className='flex flex-col gap-4'>
            <span className='dark:shadow-secondary-dark dark:bg-subtle-black p-3 rounded-lg border dark:border-theme-secondary-500 flex items-start justify-start dark:text-white text-base font-normal leading-5 bg-white border-theme-secondary-400 text-light-black break-all text-left' dangerouslySetInnerHTML={{ __html: errorParser(error) }} />

            <button className='bg-transparent px-4 py-0.5 cursor-pointer text-light-black text-base font-medium leading-5 dark:text-theme-secondary-200 flex flex-row gap-3 justify-center items-center hover:underline' onClick={handleClick}>
                <Icon icon='copy' className='h-4 w-4' />
                {t('COMMON.COPY_with_name', { name: t('COMMON.ERROR') })}
            </button>
        </div>
    );
};

const ErrorModal = ({ error, onClose, onBack }: Props) => {
    const { t } = useTranslation();
    return (
        <div className='fixed left-0 top-0 z-50 flex h-screen w-full bg-subtle-white dark:bg-light-black flex-col'>
            <div className='flex w-full flex-col items-center justify-between gap-4 px-4 flex-1'>
                <div className='flex h-full flex-col items-center justify-center gap-4 w-full'>
                    <SmallWarningIcon />

                    <div className='flex flex-col gap-4 w-full'>
                        <Heading level={3} className='mb-2 text-center'>
                            {errorTitleParser(error)}
                        </Heading>

                        <div className='break-words text-center text-theme-secondary-500 dark:text-theme-secondary-300'>
                            {error ? (
                                <ErrorContainer error={error} />
                            ) : (
                                <Trans i18nKey='MISC.UNKNOWN_CONNECTION_ERROR' />
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className='flex-none flex w-full flex-col items-center dark:bg-subtle-black bg-white shadow-button-container dark:shadow-button-container-dark p-4 gap-5'>
                    <div className='grid grid-cols-2 gap-2 w-full'>
                        <Button variant='secondary' onClick={onClose}>
                            {t('ACTION.CLOSE')}
                        </Button>
                        <Button variant='primary' onClick={onBack}>
                            {t('COMMON.BACK')}
                        </Button>
                    </div>

                    <ExternalLink
                        className='flex w-full items-center justify-center gap-2 text-light-black dark:text-white'
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
