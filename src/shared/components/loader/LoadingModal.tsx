import { useAppSelector } from '@/lib/store';
import { CTA_CONTENT, selectLoadingModal } from '@/lib/store/modal';
import { Heading, HeadingDescription, Icon, Loader } from '@/shared/components';

const LoadingModal = () => {
    const { isLoading, isOpen, completedMessage, loadingMessage, completedDescription, CTA } =
        useAppSelector(selectLoadingModal);

    const CTAContent = CTA ? CTA_CONTENT[CTA] : undefined;

    if (!isOpen) return null;

    return (
        <div className='bg-subtle-white dark:bg-light-black fixed top-0 left-0 z-10 flex h-screen w-full items-center justify-center'>
            <div className='flex flex-col items-center gap-6 px-4'>
                {!isLoading ? (
                    <>
                        <Icon
                            icon='completed'
                            className='text-theme-primary-700 dark:text-theme-primary-650 h-16 w-16'
                        />
                        <div className='flex flex-col items-center justify-center'>
                            <Heading level={3}>{completedMessage}</Heading>
                            {completedDescription && (
                                <HeadingDescription className='mt-2 max-w-[243px] text-center'>
                                    {completedDescription}
                                </HeadingDescription>
                            )}
                        </div>
                    </>
                ) : (
                    <>
                        <Loader variant='big' />
                        <Heading level={3} className='text-center'>
                            {loadingMessage}
                        </Heading>
                        {!!CTAContent && <CTAContent />}
                    </>
                )}
            </div>
        </div>
    );
};

export default LoadingModal;
