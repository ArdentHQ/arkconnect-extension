import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Contracts } from '@ardenthq/sdk-profiles';
import SubPageLayout, { SettingsRowItem } from '../SubPageLayout';
import { Container, Icon, Paragraph } from '@/shared/components';
import { Currency, general } from '@/lib/data/general';
import useToast from '@/lib/hooks/useToast';
import { useProfileContext } from '@/lib/context/Profile';
import { useEnvironmentContext } from '@/lib/context/Environment';
import { ToastPosition } from '@/components/toast/ToastContainer';

const ChangeLocalCurrency = () => {
    const toast = useToast();
    const navigate = useNavigate();
    const { profile } = useProfileContext();
    const { persist } = useEnvironmentContext();
    const currency = profile.settings().get<string>(Contracts.ProfileSetting.ExchangeCurrency);

    const changeCurrency = async (currency: Currency) => {
        profile.settings().set(Contracts.ProfileSetting.ExchangeCurrency, currency.value);
        await persist();

        toast('success', 'Currency changed successfully', ToastPosition.HIGH);

        navigate('/');
    };

    useEffect(() => {
        const element = document.getElementById('scrollable-container');
        const selectedCurrencyIndex = general.currencies.findIndex(
            (currencyItem) => currencyItem.value === currency,
        );

        if (element && selectedCurrencyIndex !== -1) {
            const rowHeight = 50;
            element.scrollTo({ top: selectedCurrencyIndex * rowHeight, behavior: 'smooth' });
        }
    }, [currency]);

    return (
        <SubPageLayout title='Change Local Currency' withStickyHeader>
            <Container borderRadius='16' paddingY='8' bg='secondaryBackground'>
                {general.currencies.map((currencyItem) => (
                    <SettingsRowItem
                        key={currencyItem.value}
                        className={currencyItem.value == currency ? 'active' : ''}
                        onClick={() => changeCurrency(currencyItem)}
                        tabIndex={0}
                        as='button'
                        width='100%'
                    >
                        <Paragraph $typeset='headline' as='span'>
                            {currencyItem.label}
                        </Paragraph>
                        {currencyItem.value == currency && (
                            <Icon icon='check' className='h-5 w-5' />
                        )}
                    </SettingsRowItem>
                ))}
            </Container>
        </SubPageLayout>
    );
};

export default ChangeLocalCurrency;
