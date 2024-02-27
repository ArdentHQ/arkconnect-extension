import { useAppSelector } from '@/lib/store';
import { selectLoadingModal, CTA_CONTENT } from '@/lib/store/modal';
import { FlexContainer, Heading, Icon, Loader, Paragraph } from '@/shared/components';

const LoadingModal = () => {
    const { isLoading, isOpen, completedMessage, loadingMessage, completedDescription, CTA } =
        useAppSelector(selectLoadingModal);

    const CTAContent = CTA ? CTA_CONTENT[CTA] : undefined;

    if (!isOpen) return null;
    return (
        <FlexContainer
            width='100%'
            height='100vh'
            position='fixed'
            top='0'
            left='0'
            zIndex='10'
            backgroundColor='background'
            $flexVariant='columnCenter'
        >
            <FlexContainer flexDirection='column' alignItems='center' gridGap='24px' px='16'>
                {!isLoading ? (
                    <>
                        <Icon icon='completed' width='64px' height='64px' color='primary' />
                        <FlexContainer
                            flexDirection='column'
                            justifyContent='center'
                            alignItems='center'
                        >
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
                        </FlexContainer>
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
            </FlexContainer>
        </FlexContainer>
    );
};

export default LoadingModal;
