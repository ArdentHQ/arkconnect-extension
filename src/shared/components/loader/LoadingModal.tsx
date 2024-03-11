import { useAppSelector } from '@/lib/store';
import { CTA_CONTENT, selectLoadingModal } from '@/lib/store/modal';
import { Heading, Icon, Loader, Paragraph } from '@/shared/components';

const LoadingModal = () => {
    const { isLoading, isOpen, completedMessage, loadingMessage, completedDescription, CTA } =
        useAppSelector(selectLoadingModal);

    const CTAContent = CTA ? CTA_CONTENT[CTA] : undefined;

    if (!isOpen) return null;

    return (
        <div className='fixed left-0 top-0 z-10 flex h-screen w-full items-center justify-center bg-subtle-white dark:bg-light-black'>
            <div className='flex flex-col items-center gap-6 px-4'>
                {!isLoading ? (
                    <>
                        <Icon
                            icon='completed'
                            className='h-16 w-16 text-theme-primary-700 dark:text-theme-primary-650'
                        />
                        <div className='flex flex-col items-center justify-center'>
                            <Heading $typeset='h3' color='base' fontWeight='bold'>
                                {completedMessage}
                            </Heading>
                            {completedDescription && (
                                <Paragraph
                                    $typeset='headline'
                                    maxWidth='243px'
                                    mt='8'
                                    fontWeight='regular'
                                    color='gray'
                                    textAlign='center'
                                >
                                    {completedDescription}
                                </Paragraph>
                            )}
                        </div>
                    </>
                ) : (
                    <>
                        <Loader variant='big' />
                        <Heading $typeset='h3' color='base' fontWeight='bold' textAlign={'center'}>
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
