/**
 * Theme properties for padding, margins, responsiveness, etc.
 *
 * "mediaQueries" exist as util object. May be used like
 *    const styledComponent = styled.div`
 *      ${props => props.theme.mediaQueries[0]} {
 *        // your css properties
 *      }
 *    `
 *
 */

type BreakpointAlias = 'mobile' | 'tablet' | 'desktop' | 'widescreen';
type ThemeScale<Type, Aliases extends string> = Array<Type> & Record<Aliases, Type>;

const breakpoints = ['767px', '1000px', '1200px', '1600px'] as ThemeScale<string, BreakpointAlias>;
[breakpoints.mobile, breakpoints.tablet, breakpoints.desktop, breakpoints.widescreen] = breakpoints;

const space = {
  '-2': -2,
  '-1': -1,
  '0': 0,
  '1': 1,
  '2': 2,
  '4': 4,
  '6': 6,
  '7': 7,
  '8': 8,
  '10': 10,
  '12': 12,
  '14': 14,
  '16': 16,
  '20': 20,
  '24': 24,
  '28': 28,
  '32': 32,
  '36': 36,
  '40': 40,
  '44': 44,
  '46': 46,
  '48': 48,
  '50': 50,
  '56': 56,
  '58': 58,
  '59': 59,
  '64': 64,
  '80': 80,
  '84': 84,
  '96': 96,
  '112': 112,
  '128': 128,
  '144': 144,
  '154': 154,
  '150': 150,
  '160': 160,
  '162': 162,
  '176': 176,
  '186': 186,
  '192': 192,
  '208': 208,
  '224': 224,
  '240': 240,
  '246': 246,
  '256': 256,
  '270': 270,
  '288': 288,
  '320': 320,
  '384': 384,
  auto: 'auto',
};

const mediaQueries = breakpoints.reduce(
  (acc, breakpoint, index) => {
    acc[index] = `@media screen and (min-width: ${breakpoint})`;
    return acc;
  },
  {} as Record<number, string>,
);

export default {
  space,
  breakpoints,
  mediaQueries,
};
