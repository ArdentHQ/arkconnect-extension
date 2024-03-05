import useThemeMode from '@/lib/hooks/useThemeMode';
import { useAppSelector } from '@/lib/store';
import { CTA_CONTENT, selectLoadingModal } from '@/lib/store/modal';
import { FlexContainer, Heading, Icon, Loader, Paragraph } from '@/shared/components';

const LoadingModal = () => {
    const { isLoading, isOpen, completedMessage, loadingMessage, completedDescription, CTA } =
        useAppSelector(selectLoadingModal);

    const { getThemeColor } = useThemeMode();

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
            bg={getThemeColor('subtleWhite', 'lightBlack')}
            $flexVariant='columnCenter'
        >
            <FlexContainer flexDirection='column' alignItems='center' gridGap='24px' px='16'>
                {!isLoading ? (
                    <>
                        <Icon
                            icon='completed'
                            className='w-16 h-16 text-theme-primary-700 dark:text-theme-primary-650'
                        />
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
