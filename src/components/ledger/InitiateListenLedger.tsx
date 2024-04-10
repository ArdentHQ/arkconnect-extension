import { useTranslation } from 'react-i18next';
import { useLedgerContext } from '@/lib/Ledger';
import { Button } from '@/shared/components';

const InitiateListenLedger = () => {
    const { listenDevice } = useLedgerContext();
    const { t } = useTranslation();
    return (
        <Button variant='secondary' onClick={listenDevice} className='w-[300px]'>
            {t('PAGES.IMPORT_WITH_LEDGER.REINITIATE_LEDGER_WINDOW')}
        </Button>
    );
};

export default InitiateListenLedger;
