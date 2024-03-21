import { useTranslation } from 'react-i18next';
import { ApproveActionType } from '@/pages/Approve';
import { IconDefinition } from '@/shared/components';
import ActionHeader from '@/shared/components/actions/ActionHeader';

type Props = {
    appName: string;
    appLogo: string;
    actionType: ApproveActionType;
};

const ApproveHeader = ({ appName, appLogo, actionType }: Props) => {
    const { t } = useTranslation();
    const icons: {
        [key in ApproveActionType]: IconDefinition;
    } = {
        [ApproveActionType.SIGNATURE]: 'action-sign',
        [ApproveActionType.TRANSACTION]: 'action-transaction',
        [ApproveActionType.VOTE]: 'action-vote',
        [ApproveActionType.UNVOTE]: 'action-unvote',
        [ApproveActionType.SWITCH_VOTE]: 'action-switch-vote',
    };
    const labels: {
        [key in ApproveActionType]: string;
    } = {
        [ApproveActionType.SIGNATURE]: `${t('COMMON.SIGNATURE')} ${t('COMMON.REQUESTED')}`,
        [ApproveActionType.TRANSACTION]: `${t('COMMON.TRANSACTION')} ${t('COMMON.REQUESTED')}`,
        [ApproveActionType.VOTE]: `${t('COMMON.VOTE')} ${t('COMMON.REQUESTED')}`,
        [ApproveActionType.UNVOTE]: `${t('COMMON.UNVOTE')} ${t('COMMON.REQUESTED')}`,
        [ApproveActionType.SWITCH_VOTE]: t('COMMON.REQUESTED_TO_SWITCH_VOTE'),
    };

    return (
        <ActionHeader
            actionLabel={labels[actionType]}
            appDomain={appName}
            appLogo={appLogo}
            icon={icons[actionType]}
        />
    );
};

export default ApproveHeader;
