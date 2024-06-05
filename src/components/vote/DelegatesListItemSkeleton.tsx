import Skeleton from 'react-loading-skeleton';

export const DelegatesListItemSkeleton = () => {
    return (
        <tr>
            <td className='p-4'>
                <div className='flex h-full items-center'>
                    <Skeleton width={120} height={21} />
                </div>
            </td>

            <td className='p-4'>
                <div className='flex h-full items-center'>
                    <Skeleton width={16} height={16} />
                </div>
            </td>

            <td className='p-4'>
                <div className='flex h-full items-center justify-end'>
                    <Skeleton width={47} height={24} />
                </div>
            </td>
        </tr>
    );
};
