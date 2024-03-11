import { Button, ExternalLink, Icon, SmallWarningIcon } from '@/shared/components';
import constants from '@/constants';
import { errorParser, errorTitleParser } from '@/lib/utils/errorParser';

type Props = {
    error: string | null;
    onClose: () => Promise<void>;
};

const ErrorModal = ({ error, onClose }: Props) => {
    return (
        <div className='fixed left-0 top-0 z-50 flex h-screen w-full bg-subtle-white px-4 pb-6 dark:bg-light-black'>
            <div className='flex w-full flex-col items-center justify-between gap-4'>
                <div className='flex h-full flex-col items-center justify-center gap-4'>
                    <SmallWarningIcon />

                    <div>
                        <h3 className='mb-2 text-center text-xl font-bold text-light-black dark:text-white'>
                            {errorTitleParser(error)}
                        </h3>

                        <div className=' text-center text-theme-secondary-500 dark:text-theme-secondary-300'>
                            {error ? (
                                <span
                                    dangerouslySetInnerHTML={{ __html: errorParser(error) }}
                                ></span>
                            ) : (
                                <>
                                    An unknown error occurred. Try <br /> connecting again. If this
                                    error continues <br /> send an email to our support team.
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <div className='flex w-full max-w-[340px] flex-col items-center'>
                    <Button variant='primary' onClick={onClose} className='mb-6'>
                        Close
                    </Button>

                    <ExternalLink
                        className='flex items-center justify-center w-full gap-2 text-light-black dark:text-white'
                        href={`mailto:${constants.SUPPORT_EMAIL}?subject=ARK%20Connect%20Support`}
                    >
                        <span className='font-medium'>Reach out to support team</span>

                        <Icon icon='link-external' className='h-5 w-5' />
                    </ExternalLink>
                </div>
            </div>
        </div>
    );
};

export default ErrorModal;
