import { useState } from 'react';
import { FormikProps } from 'formik';
import cn from 'classnames';
import { useTranslation } from 'react-i18next';
import { CreateWalletFormik } from '.';
import { Button, Heading, Icon, ToggleSwitch } from '@/shared/components';
import useToast from '@/lib/hooks/useToast';
import { ToastPosition } from '@/components/toast/ToastContainer';
import { TestnetIcon } from '@/components/wallet/address/Address.blocks';
import useActiveNetwork from '@/lib/hooks/useActiveNetwork';

type Props = {
    goToNextStep: () => void;
    formik: FormikProps<CreateWalletFormik>;
};

const GeneratePassphrase = ({ goToNextStep, formik }: Props) => {
    const [showPassphrase, setShowPassphrase] = useState<boolean>(false);
    const { t } = useTranslation();
    const toast = useToast();

    const selectedNetwork = useActiveNetwork();

    const copyPassphraseToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(formik.values.passphrase.join(' '));
            toast(
                'success',
                t('PAGES.CREATE_WALLET.FEEDBACK.PASSPHRASE_COPIED'),
                ToastPosition.HIGH,
            );
        } catch {
            toast(
                'danger',
                t('PAGES.CREATE_WALLET.FEEDBACK.FAILED_TO_COPY_TO_CLIPBOARD'),
                ToastPosition.HIGH,
            );
        }
    };

    const generatePassphraseUI = (word: string, index: number, sliceIndex: number) => {
        const isHidden = !showPassphrase;
        const wordLength = word.length;

        return (
            <div
                className={cn('flex items-center gap-1.5', {
                    'pb-1.5': index + 1 < sliceIndex,
                })}
                key={index}
            >
                <p className='typeset-body w-auto text-theme-secondary-500 dark:text-theme-secondary-300'>
                    {index + 1}
                </p>
                <p className='typeset-headline font-medium text-light-black dark:text-white'>
                    {isHidden ? '•'.repeat(wordLength) : word}
                </p>
            </div>
        );
    };

    return (
        <div className='flex flex-1 flex-col'>
            <div className='mb-2 flex items-center gap-2'>
                <Heading level={3}>{t('PAGES.CREATE_WALLET.SAVE_YOUR_SECRET_PASSPHRASE')}</Heading>
                {selectedNetwork.isTest() && <TestnetIcon />}
            </div>
            <p className='typeset-headline mb-4 text-theme-secondary-500 dark:text-theme-secondary-300'>
                {t('PAGES.CREATE_WALLET.WRITE_DOWN_OR_COPY_YOUR_PASSPHRASE')}
            </p>
            {formik.values.passphrase && (
                <div className='mb-4 max-h-[226px] rounded-lg border border-solid border-theme-secondary-100 bg-white p-3 dark:border-theme-secondary-400 dark:bg-subtle-black'>
                    <div className='grid grid-cols-3 gap-2.5'>
                        <div className='flex flex-1 flex-col border-r border-solid border-r-theme-secondary-200 pr-2.5 dark:border-r-theme-secondary-600'>
                            {formik.values.passphrase
                                .slice(0, 8)
                                .map((word: string, index: number) =>
                                    generatePassphraseUI(word, index, 8),
                                )}
                        </div>

                        <div className='flex flex-1 flex-col border-r border-solid border-r-theme-secondary-200 pr-2.5 dark:border-r-theme-secondary-600'>
                            {formik.values.passphrase
                                .slice(8, 16)
                                .map((word: string, index: number) =>
                                    generatePassphraseUI(word, index + 8, 16),
                                )}
                        </div>

                        <div className='flex flex-1 flex-col'>
                            {formik.values.passphrase
                                .slice(16, 24)
                                .map((word: string, index: number) =>
                                    generatePassphraseUI(word, index + 16, 24),
                                )}
                        </div>
                    </div>
                </div>
            )}
            <div className='flex items-center justify-between'>
                <ToggleSwitch
                    checked={showPassphrase}
                    onChange={() => setShowPassphrase(!showPassphrase)}
                    id='show-password'
                    title={t('ACTION.SHOW_PASSPHRASE')}
                />

                <button
                    type='button'
                    className='flex h-5 items-center gap-2 overflow-hidden text-theme-primary-700 dark:text-theme-primary-650'
                    onClick={copyPassphraseToClipboard}
                >
                    <span className='inline-block'>
                        <Icon icon='copy' className='h-4.5 w-4.5' />
                    </span>

                    <span className='typeset-headline inline-block font-medium leading-[18px]'>
                        {t('ACTION.COPY')}
                    </span>
                </button>
            </div>

            <Button variant='primary' onClick={goToNextStep} className='mt-auto'>
                {t('ACTION.CONTINUE')}
            </Button>
        </div>
    );
};

export default GeneratePassphrase;
