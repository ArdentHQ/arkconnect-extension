import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Contracts } from '@ardenthq/sdk-profiles';
import { useTranslation } from 'react-i18next';
import SubPageLayout, { SettingsRowItem } from '@/components/settings/SubPageLayout';
import { Icon } from '@/shared/components';
import { Currency, general } from '@/lib/data/general';
import useToast from '@/lib/hooks/useToast';
import { useProfileContext } from '@/lib/context/Profile';
import { useEnvironmentContext } from '@/lib/context/Environment';
import { ToastPosition } from '@/components/toast/ToastContainer';

const ChangeLocalCurrency = () => {
    const { t } = useTranslation();
    const toast = useToast();
    const navigate = useNavigate();
    const { profile } = useProfileContext();
    const { persist, env } = useEnvironmentContext();
    const currency = profile.settings().get<string>(Contracts.ProfileSetting.ExchangeCurrency);

    const changeCurrency = async (currency: Currency) => {
        profile.settings().set(Contracts.ProfileSetting.ExchangeCurrency, currency.value);
        await persist();
        await env.exchangeRates().syncAll(profile, 'ARK');

        toast(
            'success',
            t('PAGES.SETTINGS.FEEDBACK.CURRENCY_CHANGED_SUCCESSFULLY'),
            ToastPosition.HIGH,
        );

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
        <SubPageLayout title={t('PAGES.SETTINGS.CHANGE_LOCAL_CURRENCY')} withStickyHeader>
            <div className='rounded-2xl bg-white py-2 dark:bg-subtle-black overflow-hidden'>
                {general.currencies.map((currencyItem) => (
                    <SettingsRowItem
                        key={currencyItem.value}
                        active={currencyItem.value === currency}
                        onClick={() => changeCurrency(currencyItem)}
                    >
                        <span className='typeset-headline'>{currencyItem.label}</span>
                        {currencyItem.value == currency && (
                            <Icon icon='check' className='h-5 w-5' />
                        )}
                    </SettingsRowItem>
                ))}
            </div>
        </SubPageLayout>
    );
};

export default ChangeLocalCurrency;
