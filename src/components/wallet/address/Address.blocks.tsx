import { Alias, Container, FlexContainer, Icon, Paragraph, Tooltip } from '@/shared/components';
import trimAddress from '@/lib/utils/trimAddress';
import useThemeMode from '@/lib/hooks/useThemeMode';
import { ToastPosition } from '@/components/toast/ToastContainer';
import useClipboard from '@/lib/hooks/useClipboard';
import { useIsTruncated } from '@/lib/hooks/useIsTruncated';
import { useRef } from 'react';
import styled from 'styled-components';
import { KnownTarget } from 'styled-components/dist/types';
import Amount from '../Amount';
import { TippyProps } from '@tippyjs/react';

export const AddressAlias = ({
    alias,
    withTooltip = false,
    isBold = false,
}: {
    alias: string;
    withTooltip?: boolean;
    isBold?: boolean;
}) => {
    const reference = useRef<HTMLDivElement | null>(null);
    const isTruncated = useIsTruncated({ reference });
    return (
        <Container>
            <Tooltip content={alias} placement='top' disabled={!withTooltip || !isTruncated}>
                <Alias
                    $typeset='headline'
                    fontWeight={isBold ? 'bold' : 'medium'}
                    maxWidth='180px'
                    color='base'
                    ref={reference}
                >
                    {alias}
                </Alias>
            </Tooltip>
        </Container>
    );
};

export const LedgerIcon = ({ as }: { as?: KnownTarget }) => {
    return (
        <Tooltip content='Ledger Address' placement='top'>
            <FlexContainer color='gray' as={as}>
                <Icon icon='ledger-address' className='h-3.5 w-3.5' />
            </FlexContainer>
        </Tooltip>
    );
};

const StyledFlexContainer = styled(FlexContainer)`
    cursor: default;
`;

export const TestnetIcon = ({ as }: { as?: KnownTarget }) => {
    const { getThemeColor } = useThemeMode();
    return (
        <StyledFlexContainer as={as}>
            <Tooltip content='Testnet' placement='top'>
                <FlexContainer
                    alignItems='center'
                    justifyContent='center'
                    width='16px'
                    height='16px'
                    color={getThemeColor('warning500', 'warning400')}
                    backgroundColor={getThemeColor('warning50', 'testNetLabel')}
                    borderRadius='4'
                    border='1px solid'
                    borderColor={getThemeColor('warning500', 'warning400')}
                    as={as}
                >
                    <Paragraph $typeset='small'> T </Paragraph>
                </FlexContainer>
            </Tooltip>
        </StyledFlexContainer>
    );
};

export const Address = ({
    address,
    length = 10,
    tooltipPlacement = 'top',
}: {
    address: string;
    length?: number;
    tooltipPlacement?: TippyProps['placement'];
}) => {
    return (
        <Container>
            <Tooltip content={address} placement={tooltipPlacement}>
                <Paragraph $typeset='body' color='gray'>
                    {trimAddress(address, length)}
                </Paragraph>
            </Tooltip>
        </Container>
    );
};

export const AddressWithCopy = ({ address, length = 10 }: { address: string; length?: number }) => {
    const { copy } = useClipboard();
    const trimmedAddress = trimAddress(address, length);

    return (
        <Container
            className='c-pointer'
            onClick={() => {
                copy(address, trimmedAddress, ToastPosition.LOWER);
            }}
        >
            <Tooltip content='Copy address' placement='top'>
                <FlexContainer alignItems='center' gridGap='6px'>
                    <Paragraph $typeset='body' color='gray'>
                        {trimmedAddress}
                    </Paragraph>
                    <Icon icon='copy' className='h-[13px] w-[13px]' />
                </FlexContainer>
            </Tooltip>
        </Container>
    );
};

export const AddressBalance = ({
    balance,
    currency,
    maxDigits = 5,
}: {
    balance: number;
    currency: string;
    maxDigits?: number;
}) => {
    return (
        <Container color='gray'>
            <Paragraph $typeset='body' color='gray'>
                <Amount value={balance} ticker={currency} maxDigits={maxDigits} withTicker />
            </Paragraph>
        </Container>
    );
};
