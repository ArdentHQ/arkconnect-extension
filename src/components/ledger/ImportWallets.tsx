import {
  Button,
  Checkbox,
  Container,
  FlexContainer,
  Heading,
  Paragraph,
  Tooltip,
} from '@/shared/components';
import trimAddress from '@/lib/utils/trimAddress';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { BIP44 } from '@ardenthq/sdk-cryptography';
import { Contracts as ProfilesContracts } from '@ardenthq/sdk-profiles';
import { useLedgerContext, useLedgerScanner } from '@/lib/Ledger';
import useNetwork from '@/lib/hooks/useNetwork';
import { useProfileContext } from '@/lib/context/Profile';
import { FormikProps } from 'formik';
import { ImportWithLedger } from '@/pages/ImportWithLedger';
import { HandleLoadingState } from '@/shared/components/handleStates/HandleLoadingState';
import useOnError from '@/lib/hooks';
import styled from 'styled-components';
import { getNetworkCurrency } from '@/lib/utils/getActiveCoin';
import { AddressBalance } from '@/components/wallet/address/Address.blocks';

type Props = {
  goToNextStep: () => void;
  formik: FormikProps<ImportWithLedger>;
};

const ImportWallets = ({ goToNextStep, formik }: Props) => {
  const { activeNetwork: network } = useNetwork();
  const onError = useOnError();
  const retryFunctionReference = useRef<() => void>();
  const { profile } = useProfileContext();
  const ledgerScanner = useLedgerScanner(network.coin(), network.id());
  const { isBusy, importLedgerWallets } = useLedgerContext();

  const {
    scan,
    selectedWallets,
    canRetry,
    isScanning,
    abortScanner,
    wallets,
    isScanningMore,
    toggleSelect,
    isSelected,
  } = ledgerScanner;

  const showLoader = (isScanning || (isBusy && wallets.length === 0)) && !isScanningMore;

  // eslint-disable-next-line arrow-body-style
  useEffect(() => {
    return () => {
      abortScanner();
    };
  }, [abortScanner]);

  const lastPath = useMemo(() => {
    const ledgerPaths = wallets.map(({ path }) => path);
    const profileWalletsPaths = profile
      .wallets()
      .values()
      .map((wallet) => wallet.data().get<string>(ProfilesContracts.WalletData.DerivationPath));

    return [...profileWalletsPaths, ...ledgerPaths]
      .filter(Boolean)
      .sort((a, b) => (BIP44.parse(a!).addressIndex > BIP44.parse(b!).addressIndex ? -1 : 1))[0];
  }, [profile, wallets]);

  const setRetryFn = useCallback(
    (callback?: () => void) => {
      retryFunctionReference.current = callback;
    },
    [retryFunctionReference],
  );

  useEffect(() => {
    if (canRetry) {
      setRetryFn?.(() => scan(profile, lastPath));
    } else {
      setRetryFn?.(undefined);
    }
    return () => setRetryFn?.(undefined);
  }, [setRetryFn, scan, canRetry, profile, lastPath]);

  useEffect(() => {
    scan(profile, lastPath);
  }, []);

  const showImportedWalletsLength = () => {
    let lengthDescriptor: string = '';

    if (selectedWallets.length === 1) {
      lengthDescriptor = `${selectedWallets.length} Address`;
    } else if (selectedWallets.length > 1) {
      lengthDescriptor = `${selectedWallets.length} Addresses`;
    }

    return lengthDescriptor;
  };

  const importWallets = async () => {
    const coin = profile.coins().set(network.coin(), network.id());
    const importedWallets = await importLedgerWallets(selectedWallets, coin, profile);
    formik.setFieldValue('importedWallets', importedWallets);
  };

  const submitImportedWallets = async () => {
    formik.setFieldValue('wallets', selectedWallets);
    try {
      await importWallets();
      goToNextStep();
    } catch (error) {
      onError(error);
    }
  };

  const isWalletImported = (address: string) => {
    return !!profile.wallets().findByAddressWithNetwork(address, network.id());
  };

  return (
    <Container>
      <Heading $typeset='h3' fontWeight='bold' color='base' mb='8' px='24'>
        Select Addresses to Import
      </Heading>
      <Paragraph $typeset='body' color='gray' mb='24' px='24'>
        Multiple addresses can be imported too!
      </Paragraph>
      <StyledContainer
        height='260px'
        maxHeight='260px'
        className='custom-scroll'
        overflowY='scroll'
      >
        <HandleLoadingState loading={showLoader}>
          {wallets.map((wallet) => {
            const isImported = isWalletImported(wallet.address);
            return (
              <StyledFlexContainer
                key={wallet.address}
                isImported={isImported}
                isSelected={isSelected(wallet.path)}
                justifyContent='space-between'
                color={isImported ? 'gray' : 'base'}
                onClick={() => {
                  if (isImported) return;
                  toggleSelect(wallet.path);
                }}
                className='c-pointer'
              >
                <Tooltip
                  disabled={!isImported}
                  content='Address already imported'
                  placement='bottom'
                >
                  <FlexContainer
                    width='100%'
                    py='16'
                    px='24'
                    justifyContent='space-between'
                    alignItems='center'
                    color={isImported ? 'gray' : 'base'}
                  >
                    <FlexContainer gridGap='4px' flexDirection='column'>
                      <Paragraph $typeset='headline' fontWeight='medium'>
                        {trimAddress(wallet.address, 10)}
                      </Paragraph>
                      <Paragraph $typeset='body' fontWeight='regular'>
                        <AddressBalance
                          balance={wallet.balance ?? 0}
                          currency={getNetworkCurrency(network)}
                          maxDigits={2}
                        />
                      </Paragraph>
                    </FlexContainer>
                    <FlexContainer gridGap='12px' alignItems='center'>
                      <Container width='20px' height='20px'>
                        <Checkbox
                          id={`import-${wallet.address}`}
                          name={`import-${wallet.address}`}
                          disabled={isImported}
                          checked={isSelected(wallet.path) || isImported}
                          onChange={() => toggleSelect(wallet.path)}
                        />
                      </Container>
                    </FlexContainer>
                  </FlexContainer>
                </Tooltip>
              </StyledFlexContainer>
            );
          })}
        </HandleLoadingState>
      </StyledContainer>
      <Container px='24' pt='24'>
        <Button variant='primary' disabled={!selectedWallets.length} onClick={submitImportedWallets}>
          Import {showImportedWalletsLength()}
        </Button>
      </Container>
    </Container>
  );
};

const StyledFlexContainer = styled(FlexContainer)<{ isImported: boolean, isSelected: boolean }>`
  transition: all 0.5s ease;
  ${({ theme, isImported, isSelected }) => `
    ${isImported ? `
      background-color: ${theme.colors.disabledCheckbox};
    ` : `
      ${isSelected ? `background-color: ${theme.colors.checkboxBackground};` : ''}

      &:hover {
        background-color: ${theme.colors.lightestGray};
      }
    `}
  `}
`;

const StyledContainer = styled(Container)`
  ${({ theme }) => `
    border-top: 1px solid ${theme.colors.dividerGray};
    border-bottom: 1px solid ${theme.colors.dividerGray};
  `}
`;

export default ImportWallets;
