import { AutoLockTimer as AutoLockTimerEnum } from '@/lib/utils/localStorage';

const showAutoLockTimerValue = (timerKey: number) => {
  switch (timerKey) {
    case AutoLockTimerEnum.FIFTEEN_MINUTES:
      return `${timerKey} Minutes`;
    case AutoLockTimerEnum.ONE_HOUR:
      return `${timerKey / 60} Hour`;
    case AutoLockTimerEnum.TWELVE_HOURS:
      return `${timerKey / 60} Hours`;
    case AutoLockTimerEnum.TWENTY_FOUR_HOURS:
      return `${timerKey / 60} Hours`;
    default:
      return '24 Hours';
  }
};

export default showAutoLockTimerValue;
