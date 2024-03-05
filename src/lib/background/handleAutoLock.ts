import { Contracts } from '@ardenthq/sdk-profiles';
import { runtime } from 'webextension-polyfill';
import { AutoLockTimer, getLocalValues } from '@/lib/utils/localStorage';

export class LockHandler {
    #lockTimer: NodeJS.Timeout | null = null;
    autoLockMinutes: AutoLockTimer | null = null;

    #isLocked = false;

    isLocked = () => {
        return this.#isLocked;
    };

    unlock = async (profile: Contracts.IProfile, password: string | null | undefined) => {
        this.#isLocked = profile?.password().get() !== password;

        return this.#isLocked;
    };

    lock = () => {
        this.#isLocked = true;
    };

    reset = () => {
        this.#isLocked = false;
        this.#lockTimer = null;
        this.autoLockMinutes = null;
    };

    setLastActiveTime = async (refreshAutoLockMinutes = false) => {
        if (this.#lockTimer) {
            clearTimeout(this.#lockTimer);
        }

        if (!this.autoLockMinutes || refreshAutoLockMinutes) {
            const { autoLockTimer } = await getLocalValues();
            this.autoLockMinutes = autoLockTimer ?? AutoLockTimer.TWENTY_FOUR_HOURS;
        }

        this.#lockTimer = setTimeout(this._onTimeout, this.autoLockMinutes * 60 * 1000);
    };

    disableTimer = async () => {
        if (this.#lockTimer) {
            clearTimeout(this.#lockTimer);
        }

        this.#lockTimer = null;
    };

    _onTimeout = () => {
        this.lock();
        runtime
            .sendMessage({
                type: 'LOCK_EXTENSION_UI',
            })
            .catch((error) => {
                // eslint-disable-next-line no-console
                console.log('Error occurred when sending `LOCK_EXTENSION_UI` message.', error);
            });
    };
}
