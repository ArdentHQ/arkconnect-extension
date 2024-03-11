import { Paragraph } from '@/shared/components';

type Props = {
    step: number;
    disabled?: boolean;
};

const Step = ({ step, disabled = false }: Props) => {
    return (
        <div className='flex min-h-6 min-w-6 items-center justify-center rounded-[44px] bg-theme-primary-50 dark:bg-theme-secondary-600'>
            <Paragraph
                $typeset='body'
                fontWeight='medium'
                color={disabled ? 'primary700' : 'primary'}
            >
                {step}
            </Paragraph>
        </div>
    );
};

export default Step;
