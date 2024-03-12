import { Link } from 'react-router-dom';
import cn from 'classnames';
import { isFirefox } from '@/lib/utils/isFirefox';

type InternalLinkProps = React.ComponentPropsWithRef<typeof Link> & {
    className?: string;
};

export const InternalLink = ({
    className,
    ...rest
}: InternalLinkProps) => {
    return (
        <Link className={cn('no-underline cursor-pointer hover:underline', {
            'outline outline-2': isFirefox,
        }, className)} {...rest} />
    );
};