import { Paragraph, BigButton, Tooltip } from '@/shared/components';
import { useNavigate } from 'react-router-dom';
import browser from 'webextension-polyfill';
import SubPageLayout from '@/components/settings/SubPageLayout';
import useThemeMode from '@/lib/hooks/useThemeMode';
import { isFirefox } from '@/lib/utils/isFirefox';
import { useEffect } from 'react';
import { clearPersistScreenData } from '@/components/wallet/form-persist/helpers';

const InitialImportWallet = () => {
  const navigate = useNavigate();

  const { getThemeColor } = useThemeMode();

  useEffect(() => {
    clearPersistScreenData();
  }, []);

  return (
    <SubPageLayout title='Import an Existing Address' onBack='goBack'>
      <Paragraph
        $typeset='headline'
        fontWeight='regular'
        marginBottom='24'
        color={getThemeColor('gray500', 'gray300')}
      >
        Select an option below that you would like to proceed with...
      </Paragraph>
      <BigButton
        iconLeading='key'
        iconTrailing='arrow-right'
        title='Enter Passphrase'
        helperText='Use your 12 or 24-word passphrase to securely access your address.'
        color='primary'
        mb='8'
        onClick={() => navigate('/wallet/import')}
      />

      <Tooltip
        disabled={!isFirefox}
        content={
          <Paragraph>
            ARK Connect requires the use of a chromium <br /> based browser when using a Ledger.
          </Paragraph>
        }
        placement='bottom'
      >
        <div>
          <BigButton
            iconLeading='usb-flash-drive'
            iconTrailing='arrow-right'
            title='Connect Ledger Device'
            helperText='Import your ARK address using a Ledger device. A new tab will open.'
            disabled={isFirefox}
            onClick={() => {
              if (isFirefox) return;
              browser.tabs.create({
                url: browser.runtime.getURL('/src/main.html?import_with_ledger'),
              });
              window.close(); // Close extension popup as we navigate away
            }}
            color='primary'
          />
        </div>
      </Tooltip>
    </SubPageLayout>
  );
};

export default InitialImportWallet;
