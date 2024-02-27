import { ApproveActionType } from '@/pages/Approve';
import { IconDefinition } from '@/shared/components';
import ActionHeader from '@/shared/components/actions/ActionHeader';

type Props = {
    appName: string;
    appLogo: string;
    actionType: ApproveActionType;
};

const ApproveHeader = ({ appName, appLogo, actionType }: Props) => {
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
        [ApproveActionType.SIGNATURE]: 'Signature Requested',
        [ApproveActionType.TRANSACTION]: 'Transaction Requested',
        [ApproveActionType.VOTE]: 'Vote Requested',
        [ApproveActionType.UNVOTE]: 'Unvote Requested',
        [ApproveActionType.SWITCH_VOTE]: 'Requested to Switch Vote',
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
