export const ActionDetailsRow = ({
    label,
    children,
}: {
    label: string | React.ReactNode;
    children: string | React.ReactNode;
}) => {
    return (
        <div className='flex justify-between border-b border-solid border-b-theme-secondary-100 p-3 last:border-b-0 dark:border-b-theme-secondary-700'>
            <div className=' text-theme-secondary-500 dark:text-theme-secondary-300'>{label}</div>

            {children}
        </div>
    );
};

const ActionDetails = ({
    children,
    maxHeight,
}: {
    children: React.ReactNode;
    maxHeight?: string;
}) => {
    return (
        <div className='flex h-full w-full flex-col items-center'>
            <div className=' mb-2 text-center text-sm font-medium text-theme-secondary-500 dark:text-theme-secondary-300'>
                Details
            </div>

            <div
                className='custom-scroll shadow-action-details dark:shadow-action-details-dark w-full overflow-auto rounded-lg bg-white dark:bg-subtle-black'
                style={{
                    maxHeight: maxHeight,
                }}
            >
                {children}
            </div>
        </div>
    );
};

export default ActionDetails;
