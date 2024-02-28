const black = '#333333';
const lightBlack = '#2B2B2B';
const subtleBlack = '#383838';
const white = '#FFFFFF';
const subtleWhite = '#F8F8F8';
const disabledCheckedLight = '#9ADCC1';

const primary50 = '#EEFFF7';
const primary100 = '#D7FFEE';
const primary200 = '#B2FFDD';
const primary300 = '#77FEC4';
const primary500 = '#0add84';
const primary600 = '#01B86C';
const primary650 = '#02A863';
const primary700 = '#058751';
const primary800 = '#0A7147';
const primary900 = '#0B5C3C';
const primary950 = '#003420';

const secondary25 = '#FCFCFC';
const secondary50 = '#F5F5F5';
const secondary100 = '#EEEEEE';
const secondary200 = '#E5E5E5';
const secondary300 = '#B7B7B7';
const secondary400 = '#A3A3A3';
const secondary500 = '#737373';
const secondary600 = '#525252';
const secondary700 = '#484646';
const secondary800 = '#292929';
const secondary900 = '#141414';

const error25 = '#FFFBFA';
const error50 = '#FEF3F2';
const error100 = '#FEE4E2';
const error200 = '#FECDCA';
const error300 = '#FDA29B';
const error400 = '#F97066';
const error500 = '#F9564A';
const error600 = '#D92D20';
const error700 = '#B42318';
const error800 = '#912018';
const error900 = '#7A271A';

const warning25 = '#FFFCF5';
const warning50 = '#FFFAEB';
const warning100 = '#FEF0C7';
const warning200 = '#FEDF89';
const warning300 = '#FEC84B';
const warning400 = '#FDB022';
const warning500 = '#F79009';
const warning600 = '#DC6803';
const warning700 = '#B54708';
const warning800 = '#93370D';
const warning900 = '#7A2E0E';

const light = {
    primary: primary700,
    error: error600,
    ledgerConnectionError: error600,
    warning: warning600,
    gray: secondary500,
    primaryBorder: secondary100,
    border: secondary400,
    activeInput: lightBlack,
    lightGray: secondary100,
    disabledCheckbox: secondary100,
    primaryBackground: subtleWhite,
    secondaryBackground: white,
    lightGreen: primary50,
    lightestGray: secondary50,
    background: white,
    base: lightBlack,
    inputBackground: white,
    inputHover: '#CCEEE0',
    inputBackgroundGreen: primary50,
    checkboxBackground: primary50,
    toggleInactive: secondary200,
    primaryDisabled: secondary100,
    activeNav: primary800,
    ledgerErrorText: error600,
    toggleHover: primary600,
    disabledChecked: disabledCheckedLight,
    disabledRadio: secondary300,
    disabledRadioBackground: secondary100,
    disabledGray: secondary200,
    tooltipBackground: subtleBlack,
    label: secondary500,
    labelText: subtleBlack,
    tooltipColor: white,
    dividerGreen: primary650,
    warningBorder: warning600,
    lightGrayHover: secondary100,
    lightGrayHover2: secondary200,
    lightGreenHover: '#D3F6E6',
    lightGrayBackground: secondary200,
    loaderBackground: secondary100,
    logoText: primary950,
    secondaryButtonHover: primary50,
    destructiveSecondary: error50,
    destructivePrimaryDisabled: error300,
    destructiveShadow: error100,
    secondaryBlackButton: subtleBlack,
    secondaryBlackHover: secondary50,
    secondaryBlackShadow: secondary50,
    primaryFocused: '#E5F3ED',
    testNetLabel: warning50,
    ledgerStep: primary50,
    ledgerWalletStep: primary100,
    rejected: error50,
    rejectedBorder: error400,
    destructiveSecondaryShadow: error100,
    transparent: 'transparent',
    signedSignature: primary50,
    black,
    subtleBlack,
    white,
    subtleWhite,
    lightBlack,
    radioButton: primary700,

    primary50,
    primary100,
    primary200,
    primary300,
    primary500,
    primary600,
    primary650,
    primary700,
    primary800,
    primary900,
    primary950,

    secondary25,
    secondary50,
    secondary100,
    secondary200,
    secondary300,
    secondary400,
    secondary500,
    secondary600,
    secondary700,
    secondary800,
    secondary900,

    error25,
    error50,
    error100,
    error200,
    error300,
    error400,
    error500,
    error600,
    error700,
    error800,
    error900,

    warning25,
    warning50,
    warning100,
    warning200,
    warning300,
    warning400,
    warning500,
    warning600,
    warning700,
    warning800,
    warning900,
};

const dark = {
    primary: primary650,
    error: error500,
    ledgerConnectionError: white,
    warning: warning500,
    gray: secondary300,
    lightGray: secondary400,
    disabledCheckbox: 'transparent',
    primaryBackground: lightBlack,
    secondaryBackground: subtleBlack,
    lightGreen: '#02a8631f',
    lightestGray: secondary700,
    background: lightBlack,
    base: white,
    inputBackground: subtleBlack,
    inputHover: primary900,
    inputBackgroundGreen: primary900,
    checkboxBackground: primary950,
    toggleInactive: secondary600,
    primaryDisabled: secondary700,
    primaryBorder: white,
    border: secondary500,
    activeInput: secondary300,
    activeNav: primary600,
    ledgerErrorText: white,
    toggleHover: primary700,
    disabledChecked: primary800,
    disabledRadio: secondary100,
    disabledRadioBackground: black,
    disabledGray: secondary500,
    tooltipBackground: subtleWhite,
    label: secondary200,
    labelText: secondary200,
    tooltipColor: subtleBlack,
    dividerGreen: primary600,
    warningBorder: warning400,
    lightGrayHover: secondary700,
    lightGrayHover2: secondary700,
    lightGreenHover: '#355C4D',
    lightGrayBackground: secondary700,
    loaderBackground: subtleBlack,
    logoText: white,
    secondaryButtonHover: secondary800,
    destructiveSecondary: 'rgba(91, 16, 5, 0.08)',
    destructivePrimaryDisabled: 'rgba(240, 68, 56, 0.20)',
    destructiveShadow: '#552D2A',
    secondaryBlackButton: white,
    secondaryBlackHover: secondary700,
    secondaryBlackShadow: '#3B3A3A',
    primaryFocused: 'rgba(74, 205, 151, 0.24)',
    testNetLabel: 'rgba(247, 144, 9, 0.10)',
    ledgerStep: secondary600,
    ledgerWalletStep: 'rgba(2, 168, 99, 0.20)',
    rejected: 'rgba(240, 68, 56, 0.10)',
    rejectedBorder: error500,
    destructiveSecondaryShadow: '#43302F',
    transparent: 'transparent',
    signedSignature: primary500,
    black,
    subtleBlack,
    white,
    subtleWhite,
    lightBlack,
    radioButton: primary600,

    primary50,
    primary100,
    primary200,
    primary500,
    primary600,
    primary650,
    primary700,
    primary800,
    primary900,
    primary950,

    secondary25,
    secondary50,
    secondary100,
    secondary200,
    secondary300,
    secondary400,
    secondary500,
    secondary600,
    secondary700,
    secondary800,
    secondary900,

    error25,
    error50,
    error100,
    error200,
    error300,
    error400,
    error500,
    error600,
    error700,
    error800,
    error900,

    warning25,
    warning50,
    warning100,
    warning200,
    warning300,
    warning400,
    warning500,
    warning600,
    warning700,
    warning800,
    warning900,
};

export const themeModes = {
    dark,
    light,
};

export default {
    colors: light,
};
