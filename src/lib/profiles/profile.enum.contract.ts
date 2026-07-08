export enum ProfileSetting {
    AutomaticSignOutPeriod = 'AUTOMATIC_SIGN_OUT_PERIOD',
    Avatar = 'AVATAR',
    Bip39Locale = 'BIP39_LOCALE',
    ExchangeCurrency = 'EXCHANGE_CURRENCY',
    MarketProvider = 'MARKET_PROVIDER',
    Name = 'NAME',
    Password = 'PASSWORD',
    FallbackToDefaultNodes = 'FALLBACK_TO_DEFAULT_NODES',
    // UI
    DashboardConfiguration = 'DASHBOARD_CONFIGURATION',
    DoNotShowFeeWarning = 'DO_NOT_SHOW_FEE_WARNING',
    Locale = 'LOCALE',
    Theme = 'THEME',
    TimeFormat = 'TIME_FORMAT',
    UseNetworkWalletNames = 'USE_NETWORK_WALLET_NAMES',
    LastVisitedPage = 'LAST_VISITED_PAGE',
    Sessions = 'SESSIONS',
    HideDustTokens = 'HIDE_DUST_TOKEN',
}

export enum ProfileData {
    LatestMigration = 'LATEST_MIGRATION',
    HasCompletedIntroductoryTutorial = 'HAS_COMPLETED_INTRODUCTORY_TUTORIAL',
    HasAcceptedManualInstallationDisclaimer = 'HAS_ACCEPTED_MANUAL_INSTALLATION_DISCLAIMER',
    WhitelistedContractAddresses = 'WHITELISTED_CONTRACT_ADDRESS',
}
