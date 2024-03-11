import { useState } from 'react';
import { FormikProps } from 'formik';
import classNames from 'classnames';
import { CreateWalletFormik } from '.';
import { Button, Grid, Heading, Icon, Paragraph, ToggleSwitch } from '@/shared/components';
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

    const toast = useToast();

    const selectedNetwork = useActiveNetwork();

    const copyPassphraseToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(formik.values.passphrase.join(' '));
            toast('success', 'Passphrase Copied to Clipboard', ToastPosition.HIGH);
        } catch {
            toast('danger', 'Failed to Copy to Clipboard', ToastPosition.HIGH);
        }
    };

    const generatePassphraseUI = (word: string, index: number, sliceIndex: number) => {
        const isHidden = !showPassphrase;
        const wordLength = word.length;

        return (
            <div
                className={classNames('flex items-center gap-1.5', {
                    'pb-1.5': index + 1 < sliceIndex,
                })}
                key={index}
            >
                <Paragraph
                    $typeset='body'
                    className='text-theme-secondary-500 dark:text-theme-secondary-300'
                    width='auto'
                >
                    {index + 1}
                </Paragraph>
                <Paragraph
                    $typeset='headline'
                    fontWeight='medium'
                    className='text-light-black dark:text-white'
                >
                    {isHidden ? '•'.repeat(wordLength) : word}
                </Paragraph>
            </div>
        );
    };

    return (
        <div className='flex flex-1 flex-col'>
            <div className='mb-2 flex items-center gap-2'>
                <Heading $typeset='h3' fontWeight='bold' color='base'>
                    Save Your Secret Passphrase
                </Heading>
                {selectedNetwork.isTest() && <TestnetIcon />}
            </div>
            <Paragraph
                $typeset='headline'
                className='text-theme-secondary-500 dark:text-theme-secondary-300'
                mb='16'
            >
                Write down or copy your passphrase. Make sure to store it safely.
            </Paragraph>
            {formik.values.passphrase && (
                <div className='mb-4 max-h-[226px] rounded-lg border border-solid border-theme-secondary-100 bg-white p-3 dark:border-theme-secondary-400 dark:bg-subtle-black'>
                    <Grid gridGap='10px' gridTemplateColumns='repeat(3, 1fr)'>
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
                    </Grid>
                </div>
            )}
            <div className='flex items-center justify-between'>
                <ToggleSwitch
                    checked={showPassphrase}
                    onChange={() => setShowPassphrase(!showPassphrase)}
                    id='show-password'
                    title='Show Passphrase'
                />

                <button
                    type='button'
                    className='flex h-5 items-center gap-2 overflow-hidden text-theme-primary-700 dark:text-theme-primary-650'
                    onClick={copyPassphraseToClipboard}
                >
                    <span className='inline-block'>
                        <Icon icon='copy' className='h-4.5 w-4.5' />
                    </span>

                    <Paragraph
                        $typeset='headline'
                        fontWeight='medium'
                        as='span'
                        style={{ lineHeight: '18px' }}
                        display='inline-block'
                    >
                        Copy
                    </Paragraph>
                </button>
            </div>

            <Button variant='primary' onClick={goToNextStep} className='mt-auto'>
                Continue
            </Button>
        </div>
    );
};

export default GeneratePassphrase;
