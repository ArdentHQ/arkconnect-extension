import dayjs from 'dayjs';

export const formatUnixTimestamp = (timestamp: number): string => {
    const date = dayjs(timestamp * 1000);

    const formattedDate = date.format('DD MMM YYYY, HH:mm:ss');

    return formattedDate;
};
