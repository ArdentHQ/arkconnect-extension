import { it, describe, expect } from 'vitest';
import showAutoLockTimerValue from './showAutoLockTimerValue';
import { AutoLockTimer as AutoLockTimerEnum } from '@/lib/utils/localStorage';

describe('showAutoLockTimerValue', () => {
  it('returns "15 minutes" for FIFTEEN_MINUTES timer', () => {
    expect(showAutoLockTimerValue(AutoLockTimerEnum.FIFTEEN_MINUTES)).toBe('15 Minutes');
  });

  it('returns "1 hour" for ONE_HOUR timer', () => {
    expect(showAutoLockTimerValue(AutoLockTimerEnum.ONE_HOUR)).toBe('1 Hour');
  });

  it('returns "12 hours" for TWELVE_HOURS timer', () => {
    expect(showAutoLockTimerValue(AutoLockTimerEnum.TWELVE_HOURS)).toBe('12 Hours');
  });

  it('returns "24 hours" for TWENTY_FOUR_HOURS timer', () => {
    expect(showAutoLockTimerValue(AutoLockTimerEnum.TWENTY_FOUR_HOURS)).toBe('24 Hours');
  });

  it('returns default value "24 hours" for unknown timer', () => {
    expect(showAutoLockTimerValue(999)).toBe('24 Hours');
  });
});
