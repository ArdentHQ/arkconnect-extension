import dayjs, { extend } from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
extend(relativeTime);

export const getTimeAgo = (date: string | number): string => {
    return dayjs().to(date);
};
