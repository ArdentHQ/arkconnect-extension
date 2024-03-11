import { runtime } from 'webextension-polyfill';
import SubPageLayout from '../SubPageLayout';
import { ExternalLink, Icon, Paragraph, RowLayout } from '@/shared/components';
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
                        className='h-[3.25rem] w-[3.25rem] text-theme-primary-700 dark:text-theme-primary-650'
                    />
                    <Icon
                        icon='logo-text'
                        className='h-[21px] w-[228px] text-theme-primary-700 dark:text-theme-primary-650'
                    />
                </div>
                <Paragraph $typeset='body' fontWeight='regular' color='gray'>
                    Version {runtime.getManifest().version}
                </Paragraph>
            </div>

            <div className='flex flex-col gap-2 text-light-black dark:text-white'>
                <ExternalLink
                    className='flex w-full items-center justify-between rounded-2xl'
                    href={`mailto:${constants.SUPPORT_EMAIL}?subject=ARK%20Connect`}
                >
                    <RowLayout title='Support Email' iconTrailing='link-external' tabIndex={-1}>
                        <button onClick={copyEmailToClipboard} type='button'>
                            <Icon
                                icon='copy'
                                className='h-5 w-5 text-light-black dark:text-white'
                            />
                        </button>
                    </RowLayout>
                </ExternalLink>

                <ExternalLink
                    className='flex w-full items-center justify-between rounded-2xl'
                    href={constants.ARK_CONNECT}
                    target='_blank'
                    rel='noopener noreferrer'
                >
                    <RowLayout
                        title='Official Website'
                        iconTrailing='link-external'
                        tabIndex={-1}
                    />
                </ExternalLink>
                <ExternalLink
                    className='flex w-full items-center justify-between rounded-2xl'
                    href={constants.TERMS_OF_SERVICE}
                    target='_blank'
                    rel='noopener noreferrer'
                >
                    <RowLayout
                        title='Terms of Service'
                        iconTrailing='link-external'
                        tabIndex={-1}
                    />
                </ExternalLink>
                <ExternalLink
                    className='flex w-full items-center justify-between rounded-2xl'
                    href={constants.PRIVACY_POLICY}
                    target='_blank'
                    rel='noopener noreferrer'
                >
                    <RowLayout title='Privacy Policy' iconTrailing='link-external' tabIndex={-1} />
                </ExternalLink>
            </div>
        </SubPageLayout>
    );
};

export default AboutARK;
