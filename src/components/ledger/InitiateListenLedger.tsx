import { useLedgerContext } from '@/lib/Ledger';
import { Button } from '@/shared/components';

const InitiateListenLedger = () => {
  const { listenDevice } = useLedgerContext();
  return (
    <Button variant='secondary' onClick={listenDevice} width='300px'>
      Reinitiate Ledger Window
    </Button>
  );
};

export default InitiateListenLedger;
