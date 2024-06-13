import { Trans, useTranslation } from 'react-i18next';
import { Button, ExternalLink, Heading, Icon, SmallWarningIcon } from '@/shared/components';
import constants from '@/constants';
import { errorParser, errorTitleParser } from '@/lib/utils/errorParser';
type Props = {
    error: string | null;
    onClose: () => Promise<void>;
};

const ErrorModal = ({ error, onClose }: Props) => {
    const { t } = useTranslation();
    return (
        <div className='fixed left-0 top-0 z-50 flex h-screen w-full bg-subtle-white px-4 pb-6 dark:bg-light-black'>
            <div className='flex w-full flex-col items-center justify-between gap-4'>
                <div className='flex h-full flex-col items-center justify-center gap-4'>
                    <SmallWarningIcon />

                    <div>
                        <Heading level={3} className='mb-2 text-center'>
                            {errorTitleParser(error)}
                        </Heading>

                        <div className='text-center text-theme-secondary-500 dark:text-theme-secondary-300 break-words max-w-80'>
                            {error ? (
                                <span
                                    dangerouslySetInnerHTML={{ __html: errorParser(error) }}
                                ></span>
                            ) : (
                                <Trans i18nKey='MISC.UNKNOWN_CONNECTION_ERROR' />
                            )}
                        </div>
                    </div>
                </div>

                <div className='flex w-full max-w-[340px] flex-col items-center'>
                    <Button variant='primary' onClick={onClose} className='mb-6'>
                        {t('ACTION.CLOSE')}
                    </Button>

                    <ExternalLink
                        className='flex w-full items-center justify-center gap-2 text-light-black dark:text-white'
                        href={`mailto:${constants.SUPPORT_EMAIL}?subject=${encodeURIComponent(t('MISC.ARK_CONNECT_SUPPORT'))}`}
                    >
                        <span className='font-medium'>{t('MISC.REACH_OUT_TO_SUPPORT_TEAM')}</span>

                        <Icon icon='link-external' className='h-5 w-5' />
                    </ExternalLink>
                </div>
            </div>
        </div>
    );
};

export default ErrorModal;
