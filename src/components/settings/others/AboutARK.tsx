import { runtime } from 'webextension-polyfill';
import SubPageLayout from '../SubPageLayout';
import { Icon, RowLayout } from '@/shared/components';
import useClipboard from '@/lib/hooks/useClipboard';
import constants from '@/constants';

const AboutARK = () => {
    const { copy } = useClipboard();

    const copyEmailToClipboard = (evt: React.MouseEvent<HTMLButtonElement>) => {
        evt.stopPropagation();
        evt.preventDefault();

        copy(constants.SUPPORT_EMAIL, 'Support email');
    };

    return (
        <SubPageLayout title='About ARK Connect'>
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
                    Version {runtime.getManifest().version}
                </p>
            </div>

            <div className='flex flex-col gap-2 text-light-black dark:text-white'>
                <div className='relative flex items-center'>
                    <RowLayout
                        title='Support Email'
                        iconTrailing='link-external'
                        tabIndex={-1}
                        href={`mailto:${constants.SUPPORT_EMAIL}?subject=ARK%20Connect`}
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
                    title='Official Website'
                    iconTrailing='link-external'
                    tabIndex={-1}
                    className='flex w-full items-center justify-between rounded-2xl'
                    target='_blank'
                    rel='noopener noreferrer'
                />

                <RowLayout
                    title='Terms of Service'
                    iconTrailing='link-external'
                    tabIndex={-1}
                    href={constants.TERMS_OF_SERVICE}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='flex w-full items-center justify-between rounded-2xl'
                />

                <RowLayout
                    title='Privacy Policy'
                    iconTrailing='link-external'
                    tabIndex={-1}
                    className='flex w-full items-center justify-between rounded-2xl'
                    href={constants.PRIVACY_POLICY}
                    target='_blank'
                    rel='noopener noreferrer'
                />
            </div>
        </SubPageLayout>
    );
};

export default AboutARK;
