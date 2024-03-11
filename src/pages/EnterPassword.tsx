import { useNavigate } from 'react-router-dom';
import { ChangeEvent, KeyboardEvent, useState } from 'react';
import styled from 'styled-components';
import { runtime } from 'webextension-polyfill';
import classNames from 'classnames';
import {
    Button,
    Container,
    Icon,
    InternalLink,
    Layout,
    LockIcon,
    Paragraph,
    PasswordInput,
} from '@/shared/components';
import { ValidationVariant } from '@/components/wallet/create';
import { useProfileContext } from '@/lib/context/Profile';
import { useErrorHandlerContext } from '@/lib/context/ErrorHandler';
import { useAppDispatch } from '@/lib/store';
import * as UIStore from '@/lib/store/ui';

const EnterPassword = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { initProfile } = useProfileContext();
    const { onError } = useErrorHandlerContext();
    const [password, setPassword] = useState<string>('');
    const [validationVariant, setValidationVariant] = useState<ValidationVariant>('primary');

    const unlockExtension = async () => {
        try {
            const status = await runtime.sendMessage({
                type: 'UNLOCK',
                data: { password },
            });

            if (status.isLocked) {
                setValidationVariant('destructive');
                return;
            }

            await initProfile();

            setValidationVariant('primary');

            dispatch(UIStore.lockedChanged(false));

            navigate('/');
        } catch (error) {
            onError(error);
        }
    };

    const handlePasswordChange = (evt: ChangeEvent<HTMLInputElement>) => {
        setPassword(evt.target.value);
        if (validationVariant !== 'destructive') return;
        setValidationVariant('primary');
    };

    const handleEnterKey = (evt: KeyboardEvent<HTMLInputElement>) => {
        if (evt.key === 'Enter') {
            unlockExtension();
        }
    };

    return (
        <Layout>
            <Container height='550px' px='16'>
                <div className='flex items-center justify-center py-[59px]'>
                    <LockIcon />
                </div>

                <Container>
                    <div
                        className={classNames('flex flex-col gap-1.5', {
                            'mb-5': validationVariant === 'destructive',
                            'mb-11': validationVariant !== 'destructive',
                        })}
                    >
                        <Paragraph $typeset='headline' fontWeight='medium' color='labelText'>
                            Enter Password to Unlock
                        </Paragraph>
                        <PasswordInput
                            name='password'
                            variant={validationVariant}
                            onChange={handlePasswordChange}
                            placeholder='Your Password'
                            onKeyDown={handleEnterKey}
                            value={password}
                            helperText={
                                validationVariant === 'destructive' ? 'Incorrect password' : ''
                            }
                        />
                    </div>
                    <Button
                        variant='primary'
                        onClick={unlockExtension}
                        disabled={!password.length || validationVariant === 'destructive'}
                        className='mb-6'
                    >
                        Unlock Extension
                        <StyledIconWrapper
                            className={
                                !password.length || validationVariant === 'destructive'
                                    ? 'disabled'
                                    : ''
                            }
                            as='span'
                        >
                            <Icon icon='corner-down-left' className='h-5 w-5' />
                        </StyledIconWrapper>
                    </Button>
                    <InternalLink
                        to='/forgot-password'
                        width='100%'
                        display='flex'
                        justifyContent='center'
                        alignItems='center'
                        color='base'
                    >
                        <Paragraph $typeset='headline' fontWeight='medium' color='base'>
                            Forgot Password?
                        </Paragraph>
                    </InternalLink>
                </Container>
            </Container>
        </Layout>
    );
};

const StyledIconWrapper = styled(Container)`
    width: 20px;
    height: 20px;
    position: absolute;
    top: 50%;
    right: 16px;
    transform: translateY(-50%);

    ${({ theme }) => `
    & #corner-down-left {
      stroke: ${theme.colors.primary500};
    }

    &.disabled #corner-down-left {
      stroke: ${theme.colors.secondary400};
    }
  `}
`;

export default EnterPassword;
