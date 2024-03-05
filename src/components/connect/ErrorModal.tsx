import {
    Button,
    ExternalLink,
    FlexContainer,
    Heading,
    Icon,
    Paragraph,
    SmallWarningIcon,
} from '@/shared/components';
import constants from '@/constants';
import useThemeMode from '@/lib/hooks/useThemeMode';
import { ThemeMode } from '@/lib/store/ui';
import { errorParser, errorTitleParser } from '@/lib/utils/errorParser';

type Props = {
    error: string | null;
    onClose: () => Promise<void>;
};

const ErrorModal = ({ error, onClose }: Props) => {
    const { currentThemeMode } = useThemeMode();
    return (
        <FlexContainer
            width='100%'
            height='100vh'
            position='fixed'
            top='0'
            left='0'
            zIndex='50'
            backgroundColor={currentThemeMode === ThemeMode.DARK ? 'lightBlack' : 'subtleWhite'}
            px='16'
            pb='24'
        >
            <FlexContainer
                flexDirection='column'
                alignItems='center'
                gridGap='16px'
                justifyContent='space-between'
                width='100%'
            >
                <FlexContainer
                    height='100%'
                    flexDirection='column'
                    alignItems='center'
                    justifyContent='center'
                    gridGap='16px'
                >
                    <SmallWarningIcon />
                    <Heading
                        $typeset='h3'
                        fontWeight='bold'
                        color={currentThemeMode === ThemeMode.DARK ? 'white' : 'lightBlack'}
                    >
                        {errorTitleParser(error)}
                    </Heading>
                    <Paragraph
                        $typeset='headline'
                        fontWeight='regular'
                        color='gray'
                        textAlign='center'
                    >
                        {error ? (
                            <span dangerouslySetInnerHTML={{ __html: errorParser(error) }}></span>
                        ) : (
                            <>
                                An unknown error occurred. Try <br /> connecting again. If this
                                error continues <br /> send an email to our support team.
                            </>
                        )}
                    </Paragraph>
                </FlexContainer>
                <FlexContainer
                    flexDirection='column'
                    alignItems='center'
                    width='100%'
                    maxWidth='340px'
                >
                    <Button variant='primary' onClick={onClose} className='mb-6'>
                        Close
                    </Button>
                    <ExternalLink
                        alignItems='center'
                        justifyContent='center'
                        display='flex'
                        width='100%'
                        gridGap='8px'
                        href={`mailto:${constants.SUPPORT_EMAIL}?subject=ARK%20Connect%20Support`}
                        color={currentThemeMode === ThemeMode.DARK ? 'white' : 'lightBlack'}
                    >
                        <Paragraph $typeset='headline' fontWeight='medium' as='span'>
                            Reach out to support team
                        </Paragraph>
                        <Icon icon='link-external' className='w-5 h-5' />
                    </ExternalLink>
                </FlexContainer>
            </FlexContainer>
        </FlexContainer>
    );
};

export default ErrorModal;
