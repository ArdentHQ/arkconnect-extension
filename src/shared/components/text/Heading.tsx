interface Heading2Props extends React.HTMLAttributes<HTMLHeadingElement> {
    level: 2 | 3 | 4;
}

export const HeadingTODO = ({ level, ...properties }: Heading2Props) => {
    if (level === 4) {
        return (
            <h4
                className='text-lg font-medium leading-[23px] text-light-black dark:text-white'
                {...properties}
            />
        );
    }

    if (level === 3) {
        return (
            <h3
                className='text-xl font-bold leading-[25px] text-light-black dark:text-white'
                {...properties}
            />
        );
    }

    return <h2 className=' text-2xl font-bold leading-[30px]' {...properties} />;
};
