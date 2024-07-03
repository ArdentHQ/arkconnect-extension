import { runtime } from 'webextension-polyfill';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import SubPageLayout from '@/components/settings/SubPageLayout';
import { Icon, RowLayout } from '@/shared/components';
import useClipboard from '@/lib/hooks/useClipboard';
import constants from '@/constants';
import InfoBanner from '@/shared/components/utils/InfoBanner';

const AboutARK = () => {
    const { copy } = useClipboard();
    const { t } = useTranslation();
    const [os, setOs] = useState<string | undefined>(); // State to store the OS

    useEffect(() => {
        const fetchPlatformInfo = async () => {
            const platformInfo = await runtime.getPlatformInfo();
            setOs(platformInfo.os);
        };

        fetchPlatformInfo();
    }, []);

    const copyEmailToClipboard = (evt: React.MouseEvent<HTMLButtonElement>) => {
        evt.stopPropagation();
        evt.preventDefault();

        copy(constants.SUPPORT_EMAIL, t('MISC.SUPPORT_EMAIL'));
    };

    return (
        <SubPageLayout title={t('PAGES.SETTINGS.ABOUT_ARK_CONNECT')}>
            <div className='mb-6 mt-2 flex flex-col items-center gap-4'>
                <div className='logo flex flex-col items-center gap-4'>
                    <Icon
                        icon='logo-inverted'
                        className='h-13 w-13 text-theme-primary-700 dark:text-theme-primary-650'
                    />
                    <Icon
                        icon='logo-text'
                        className='h-[21px] w-[228px] text-theme-primary-700 dark:text-theme-primary-650'
                    />
                </div>
                <p className='typeset-body text-theme-secondary-500 dark:text-theme-secondary-300'>
                    {t('MISC.VERSION')} {runtime.getManifest().version}
                </p>
            </div>

            <div className='flex flex-col gap-2 text-light-black dark:text-white'>
                <RowLayout
                    href={constants.ARK_CONNECT_DEMO}
                    title={t('MISC.DEMO_APP')}
                    iconTrailing='link-external'
                    tabIndex={-1}
                    className='flex w-full items-center justify-between rounded-2xl'
                    target='_blank'
                    rel='noopener noreferrer'
                />

                <div className='relative flex items-center'>
                    <RowLayout
                        title={t('MISC.SUPPORT_EMAIL')}
                        iconTrailing='link-external'
                        tabIndex={-1}
                        href={`mailto:${constants.SUPPORT_EMAIL}?subject=${encodeURIComponent(t('MISC.ARK_CONNECT'))}`}
                        className='flex w-full items-center justify-between rounded-2xl'
                        target='_blank'
                        rel='noopener noreferrer'
                    ></RowLayout>

                    <button
                        onClick={copyEmailToClipboard}
                        type='button'
                        className='absolute right-0 mr-12'
                    >
                        <Icon icon='copy' className='h-5 w-5 text-light-black dark:text-white' />
                    </button>
                </div>

                <RowLayout
                    href={constants.ARK_CONNECT}
                    title={t('PAGES.SETTINGS.OFFICIAL_WEBSITE')}
                    iconTrailing='link-external'
                    tabIndex={-1}
                    className='flex w-full items-center justify-between rounded-2xl'
                    target='_blank'
                    rel='noopener noreferrer'
                />

                <RowLayout
                    title={t('MISC.TERMS_OF_SERVICE')}
                    iconTrailing='link-external'
                    tabIndex={-1}
                    href={constants.TERMS_OF_SERVICE}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='flex w-full items-center justify-between rounded-2xl'
                />

                <RowLayout
                    title={t('MISC.PRIVACY_POLICY')}
                    iconTrailing='link-external'
                    tabIndex={-1}
                    className='flex w-full items-center justify-between rounded-2xl'
                    href={constants.PRIVACY_POLICY}
                    target='_blank'
                    rel='noopener noreferrer'
                />
            </div>

            <div className='my-4'>
                <InfoBanner title={t('MISC.INFO_TIP')}>
                    <span>
                        {os === 'mac'
                            ? t('MISC.TIPS.SHORTCUT_TIP_MAC')
                            : t('MISC.TIPS.SHORTCUT_TIP_DEFAULT')}
                    </span>
                </InfoBanner>
            </div>
        </SubPageLayout>
    );
};

export default AboutARK;
