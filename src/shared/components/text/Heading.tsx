import { PropsWithChildren } from 'react';
import styled from 'styled-components';
import {
    color,
    ColorProps,
    fontWeight,
    FontWeightProps,
    space,
    SpaceProps,
    textAlign,
    TextAlignProps,
    width,
    WidthProps,
} from 'styled-system';
import { Theme } from '../../theme';
import { HeadingVariantProps, typesetVariant } from '@/shared/theme/variants';

type BaseProps = TextAlignProps<Theme> &
    SpaceProps<Theme> &
    FontWeightProps<Theme> &
    ColorProps<Theme> &
    WidthProps<Theme> &
    HeadingVariantProps;

const StyledHeading = styled.h1<BaseProps>`
    ${fontWeight}
    ${textAlign}
  ${space}
  ${color}
  ${width}
  ${typesetVariant}
`;

type Props = PropsWithChildren<BaseProps>;

export const Heading = (props: Props) => {
    if (!props.$typeset) {
        return null;
    }

    const colorProp = props.color as string | undefined;

    return (
        <StyledHeading as={props.$typeset} {...props} color={colorProp}>
            {props.children}
        </StyledHeading>
    );
};

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
