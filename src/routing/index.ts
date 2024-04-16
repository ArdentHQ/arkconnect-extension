import Home from '@/pages/Home';
import Connections from '@/pages/Connections';
import Onboarding from '@/pages/Onboarding';
import Approve from '@/pages/Approve';
import Connect from '@/pages/Connect';
import { IconDefinition } from '@/shared/components/icon';
import InitialImportWallet from '@/pages/InitialImportWallet';
import CreateWallet from '@/pages/CreateWallet';
import ImportWallet from '@/pages/ImportWallet';
import SplashScreen from '@/pages/SplashScreen';
import CreateOrImport from '@/components/settings/general/CreateOrImportAddress';
import ChangeLocalPassword from '@/components/settings/general/ChangeLocalPassword';
import AutoLockTimer from '@/components/settings/others/AutoLockTimer';
import ChangeLocalCurrency from '@/components/settings/others/ChangeLocalCurrency';
import AboutARK from '@/components/settings/others/AboutARK';
import EditAddressName from '@/components/settings/general/EditAddressName';
import ViewSensitiveInfo from '@/components/settings/general/ViewSensitiveInfo';
import EnterPassword from '@/pages/EnterPassword';
import ForgotPassword from '@/pages/ForgotPassword';
import Logout from '@/pages/Logout';
import MultipleWalletLogout from '@/components/settings/others/MultipleWalletLogout';
import TransactionApproved from '@/pages/TransactionApproved';
import VoteApproved from '@/pages/VoteApproved';
import WalletNotFound from '@/pages/WalletNotFound';
import ImportWithLedger from '@/pages/ImportWithLedger';
import { AddressSettings } from '@/components/wallet/AddressSettings';
import { TransactionDetails } from '@/components/transaction/TransactionDetails';

type RouteData = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Component: (...props: any[]) => JSX.Element;
    title: string;
    path: string;
    exact?: boolean;
    children?: RouteData[];
    reRoute?: string;
    icon?: IconDefinition;
};

const routes: RouteData[] = [
    {
        Component: Home,
        path: '/',
        title: 'Home',
        icon: 'home',
        exact: true,
    },
    {
        Component: Connections,
        path: '/connections',
        title: 'Connections',
        icon: 'connections',
    },
    {
        Component: CreateOrImport,
        path: '/create-import-address',
        title: 'Create or Import Address',
    },
    {
        Component: ChangeLocalPassword,
        path: '/local-password',
        title: 'Change Local Password',
    },
    {
        Component: AutoLockTimer,
        path: '/autolock-timer',
        title: 'Auto Lock Timer',
    },
    {
        Component: ChangeLocalCurrency,
        path: '/local-currency',
        title: 'Change Local Currency',
    },
    {
        Component: AboutARK,
        path: '/about',
        title: 'About ARK Connect',
    },
    {
        Component: Logout,
        path: '/logout',
        title: 'Remove Address',
    },
    {
        Component: SplashScreen,
        path: '/splash-screen',
        title: 'Splash Screen',
    },
    {
        Component: Onboarding,
        path: '/onboarding',
        title: 'Onboarding',
    },
    {
        Component: Approve,
        path: '/approve',
        title: 'Approve',
    },
    {
        Component: Connect,
        path: '/connect',
        title: 'Connect',
    },
    {
        Component: InitialImportWallet,
        path: '/wallet',
        title: 'Import Wallet Initial',
    },
    {
        Component: ImportWithLedger,
        path: '/ledger-import',
        title: 'Import with Ledger',
    },
    {
        Component: CreateWallet,
        path: '/wallet/create',
        title: 'Create Wallet',
    },
    {
        Component: ImportWallet,
        path: '/wallet/import',
        title: 'Import Wallet',
    },
    {
        Component: EnterPassword,
        path: '/enter-password',
        title: 'Enter Password',
    },
    {
        Component: EditAddressName,
        path: '/edit-address-name/:walletId',
        title: 'Edit Address Name',
    },
    {
        Component: ViewSensitiveInfo,
        path: '/view-sensitive-info/:walletId/:type',
        title: 'Show Private Key',
    },
    {
        Component: ForgotPassword,
        path: '/forgot-password',
        title: 'Forgot Password',
    },
    {
        Component: MultipleWalletLogout,
        path: '/multiple-wallet-logout',
        title: 'Multiple Wallet Logout',
    },
    {
        Component: TransactionApproved,
        path: '/transaction/success',
        title: 'Transaction Approved',
    },
    {
        Component: VoteApproved,
        path: '/vote/success',
        title: 'Vote Approved',
    },
    {
        Component: WalletNotFound,
        path: '/wallet/not-found',
        title: 'Wallet Not Found',
    },
    {
        Component: AddressSettings,
        path: '/address/settings',
        title: 'Address Settings',
    },
    {
        Component: TransactionDetails,
        path: '/transaction/:transactionId',
        title: 'Transaction Details',
    }
];

export default routes;
