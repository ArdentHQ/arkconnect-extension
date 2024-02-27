import styled from 'styled-components';
import { Contracts } from '@ardenthq/sdk-profiles';
import { Container, FlexContainer, Heading, Paragraph } from '@/shared/components';
import useThemeMode from '@/lib/hooks/useThemeMode';
import formatDomain from '@/lib/utils/formatDomain';
import {
    Address,
    AddressAlias,
    AddressBalance,
    LedgerIcon,
    TestnetIcon,
} from '@/components/wallet/address/Address.blocks';
import ConnectionLogoImage from '@/components/connections/ConnectionLogoImage';
import { getNetworkCurrency } from '@/lib/utils/getActiveCoin';

type Props = {
    connectedTo?: string;
    address: string;
    logo: string;
    wallet: Contracts.IReadWriteWallet;
};

const ConnectionStatusTitle = styled.div`
    word-break: break-word;
`;

const ConnectedSite = styled.span`
    color: ${({ theme }) => theme.colors['base']};
    font-weight: bold;
`;

const ConnectedAddress = ({ connectedTo, wallet, logo }: Props) => {
    return (
        <>
            <Container>
                <ConnectionStatusTitle>
                    <Heading $typeset='h4' fontWeight='medium' color='base'>
                        Connected Address
                    </Heading>
                </ConnectionStatusTitle>

                <Paragraph $typeset='headline' fontWeight='regular' color='gray' marginTop='6'>
                    The following address is currently connected to{' '}
                    <ConnectedSite>{formatDomain(connectedTo, false)}</ConnectedSite>
                </Paragraph>
            </Container>
            <Container>
                <AddressRow address={wallet} logo={logo} />
            </Container>
        </>
    );
};

const AddressRow = ({ address, logo }: { address: Contracts.IReadWriteWallet; logo: string }) => {
    const { getThemeColor } = useThemeMode();

    return (
        <FlexContainer
            gridGap='12'
            border='1px solid'
            borderRadius='16'
            borderColor={getThemeColor('primary600', 'primary650')}
            backgroundColor={getThemeColor('lightGreen', '#02a86326')}
            boxShadow='0 1px 4px 0 rgba(0, 0, 0, 0.05)'
            padding='16'
        >
            <Container>
                <ConnectionLogoImage
                    appLogo={logo}
                    appName='Connected'
                    borderColor={getThemeColor('primary200', '#296148')}
                    roundCorners
                    withBorder
                    width='40px'
                    height='40px'
                />
            </Container>
            <FlexContainer flexDirection='column' gridGap='4'>
                <FlexContainer gridGap='6' alignItems='center'>
                    <AddressAlias alias={address.alias() ?? ''} />

                    {address.isLedger() && <LedgerIcon />}

                    {address.network().isTest() && <TestnetIcon />}
                </FlexContainer>

                <FlexContainer gridGap='6' color='gray' alignItems='center'>
                    <Address address={address.address()} />
                    <div>•</div>
                    <AddressBalance
                        balance={address.balance()}
                        currency={getNetworkCurrency(address.network())}
                    />
                </FlexContainer>
            </FlexContainer>
        </FlexContainer>
    );
};

export default ConnectedAddress;
