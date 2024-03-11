import { useParams } from 'react-router-dom';
import { boolean, object, string } from 'yup';
import { useFormik } from 'formik';
import { useState } from 'react';
import SubPageLayout from '../SubPageLayout';
import YourPrivateKey from './YourPrivateKey';
import { Button, Checkbox, Container, PasswordInput } from '@/shared/components';
import { useErrorHandlerContext } from '@/lib/context/ErrorHandler';
import { useProfileContext } from '@/lib/context/Profile';
import YourPassphrase from '@/components/settings/general/YourPassphrase';

type SensitiveInfoFormik = {
    password: string;
    doNotShare: boolean;
};

const validationSchema = object().shape({
    password: string().required(''),
    doNotShare: boolean().required(''),
});

const texts = {
    privateKey: {
        title: 'Show Private Key',
        description:
            'Enter your password to access your private key. Do not share the private key with anyone.',
        footer: 'I am aware that sharing my private key with others may result in loss of access to my funds.',
    },
    passphrase: {
        title: 'Show Passphrase',
        description:
            'Enter your password to access your passphrase. Do not share the passphrase with anyone.',
        footer: 'I am aware that sharing my passphrase with others may result in loss of access to my funds.',
    },
};

const ViewSensitiveInfo = () => {
    const { onError } = useErrorHandlerContext();
    const { walletId, type } = useParams();
    const { profile } = useProfileContext();

    const [privateKey, setPrivateKey] = useState<string>('');
    const [passphrase, setPassphrase] = useState<string>('');

    if (!walletId) return <></>;

    const infoType = type === 'privateKey' ? 'privateKey' : 'passphrase';

    const formik = useFormik<SensitiveInfoFormik>({
        initialValues: {
            password: '',
            doNotShare: false,
        },
        validationSchema,
        onSubmit: async (values, formikHelpers) => {
            try {
                const wallet = profile.wallets().findById(walletId);
                try {
                    const mnemonic = await wallet.confirmKey().get(values.password);
                    // Validate mnemonic as it can be a non bip39 compliant string.
                    await profile.walletFactory().fromMnemonicWithBIP39({
                        coin: wallet.network().coin(),
                        network: wallet.network().id(),
                        mnemonic,
                    });

                    const privateKeyDto = await wallet
                        .privateKeyService()
                        .fromMnemonic(mnemonic, { bip39: true });

                    setPrivateKey(privateKeyDto.privateKey);
                    setPassphrase(mnemonic);
                } catch (error) {
                    formikHelpers.setFieldError('password', 'Incorrect password');
                }
            } catch (error) {
                onError(error);
            }
        },
    });

    if (privateKey.length && infoType === 'privateKey') {
        return <YourPrivateKey privateKey={privateKey} />;
    }

    if (passphrase && infoType === 'passphrase') {
        return <YourPassphrase passphrase={passphrase} />;
    }

    return (
        <SubPageLayout title={texts[infoType].title} hideCloseButton={false} paddingBottom='0'>
            <div className='flex h-full flex-col'>
                <p className='typeset-headline mb-6'>{texts[infoType].description}</p>

                <div className='flex flex-1 flex-col justify-between'>
                    <Container>
                        <PasswordInput
                            variant={formik.errors.password ? 'destructive' : 'primary'}
                            placeholder='Your password'
                            name='password'
                            helperText={formik.errors.password}
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            labelText='Enter Password to Access'
                        />
                    </Container>

                    <Container>
                        <Checkbox
                            id='doNotShare'
                            name='doNotShare'
                            checked={formik.values.doNotShare}
                            onChange={formik.handleChange}
                            title={texts[infoType].footer}
                        />

                        <Button
                            variant='primary'
                            onClick={formik.submitForm}
                            className='mt-6'
                            disabled={
                                !formik.isValid ||
                                !formik.values.password.length ||
                                !formik.values.doNotShare
                            }
                        >
                            Continue
                        </Button>
                    </Container>
                </div>
            </div>
        </SubPageLayout>
    );
};

export default ViewSensitiveInfo;
