import { useTranslation } from 'react-i18next';
import { ApproveActionType } from '@/pages/Approve';
import { IconDefinition } from '@/shared/components';
import ActionHeader from '@/shared/components/actions/ActionHeader';

type Props = {
    actionType: ApproveActionType;
};

const ApproveHeader = ({ actionType }: Props) => {
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
        [ApproveActionType.SIGNATURE]: t('COMMON.REQUESTED', { action: t('COMMON.SIGNATURE')}),
        [ApproveActionType.TRANSACTION]: t('COMMON.REQUESTED', { action: t('COMMON.TRANSACTION')}),
        [ApproveActionType.VOTE]: t('COMMON.REQUESTED', { action: t('COMMON.VOTE')}),
        [ApproveActionType.UNVOTE]: t('COMMON.REQUESTED', { action: t('COMMON.UNVOTE')}),
        [ApproveActionType.SWITCH_VOTE]: t('COMMON.REQUESTED', { action: t('COMMON.VOTE_SWAP')}),
    };

    return <ActionHeader actionLabel={labels[actionType]} icon={icons[actionType]} />;
};

export default ApproveHeader;
