import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

export const getTimeAgo = (date: string | number): string => {
    return dayjs().to(date);
};
