const black = '#333333';
const lightBlack = '#2B2B2B';
const subtleBlack = '#383838';
const white = '#FFFFFF';
const subtleWhite = '#F8F8F8';
const disabledCheckedLight = '#9ADCC1';

const green50 = '#EEFFF7';
const green100 = '#D7FFEE';
const green200 = '#B2FFDD';
const green300 = '#77FEC4';
const green500 = '#0add84';
const green600 = '#01B86C';
const green650 = '#02A863';
const green700 = '#058751';
const green800 = '#0A7147';
const green900 = '#0B5C3C';
const green950 = '#003420';

const gray25 = '#FCFCFC';
const gray50 = '#F8F8F8';
const gray100 = '#EEEEEE';
const gray200 = '#E5E5E5';
const gray300 = '#B7B7B7';
const gray400 = '#A3A3A3';
const gray500 = '#737373';
const gray600 = '#525252';
const gray700 = '#4D4C4C';
const gray800 = '#292929';
const gray900 = '#141414';

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

const red400 = '#DE5846';

const light = {
  primary: green700,
  error: error600,
  ledgerConnectionError: error600,
  warning: warning600,
  gray: gray500,
  primaryBorder: gray100,
  border: gray400,
  activeInput: lightBlack,
  lightGray: gray100,
  disabledCheckbox: gray100,
  primaryBackground: subtleWhite,
  secondaryBackground: white,
  lightGreen: green50,
  lightestGray: gray50,
  iconBackground: gray50,
  background: white,
  base: lightBlack,
  inputBackground: white,
  inputHover: '#CCEEE0',
  inputBackgroundGreen: green50,
  checkboxBackground: green50,
  toggleInactive: gray200,
  primaryDisabled: gray100,
  activeNav: green800,
  ledgerErrorText: error600,
  toggleHover: green600,
  disabledChecked: disabledCheckedLight,
  disabledRadio: gray300,
  disabledRadioBackground: gray100,
  disabledGray: gray200,
  tooltipBackground: subtleBlack,
  label: gray500,
  labelText: subtleBlack,
  tooltipColor: white,
  dividerGreen: green650,
  warningBorder: warning600,
  lightGrayHover: gray100,
  lightGrayHover2: gray200,
  lightGreenHover: '#D3F6E6',
  lightGrayBackground: gray200,
  loaderBackground: gray100,
  logoText: green950,
  secondaryButtonHover: green50,
  destructiveSecondary: error50,
  destructivePrimaryDisabled: error300,
  secondaryBlackButton: subtleBlack,
  secondaryBlackHover: gray50,
  secondaryBlackShadow: '#F7F5F5',
  primaryFocused: '#E5F3ED',
  testNetLabel: warning50,
  ledgerStep: green50,
  ledgerWalletStep: green100,
  rejected: error50,
  rejectedBorder: red400,
  destructiveSecondaryShadow: error100,
  transparent: 'transparent',
  signedSignature: green50,
  black,
  subtleBlack,
  white,
  subtleWhite,
  lightBlack,
  radioButton: green700,

  green50,
  green100,
  green200,
  green300,
  green500,
  green600,
  green650,
  green700,
  green800,
  green900,
  green950,

  gray25,
  gray50,
  gray100,
  gray200,
  gray300,
  gray400,
  gray500,
  gray600,
  gray700,
  gray800,
  gray900,

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
  primary: green650,
  error: error500,
  ledgerConnectionError: white,
  warning: warning500,
  gray: gray300,
  lightGray: gray400,
  disabledCheckbox: 'transparent',
  primaryBackground: lightBlack,
  secondaryBackground: subtleBlack,
  lightGreen: '#02a8631f',
  lightestGray: '#434343',
  background: lightBlack,
  base: white,
  inputBackground: subtleBlack,
  inputHover: green900,
  inputBackgroundGreen: green900,
  checkboxBackground: green950,
  iconBackground: '#454545',
  toggleInactive: gray600,
  primaryDisabled: gray700,
  primaryBorder: white,
  border: gray500,
  activeInput: gray300,
  activeNav: green600,
  ledgerErrorText: white,
  toggleHover: green700,
  disabledChecked: green800,
  disabledRadio: gray100,
  disabledRadioBackground: black,
  disabledGray: gray500,
  tooltipBackground: subtleWhite,
  label: gray200,
  labelText: gray200,
  tooltipColor: subtleBlack,
  dividerGreen: green600,
  warningBorder: warning400,
  lightGrayHover: gray700,
  lightGrayHover2: gray700,
  lightGreenHover: '#355C4D',
  lightGrayBackground: gray700,
  loaderBackground: subtleBlack,
  logoText: white,
  secondaryButtonHover: gray800,
  destructiveSecondary: 'rgba(91, 16, 5, 0.08)',
  destructivePrimaryDisabled: 'rgba(240, 68, 56, 0.20)',
  secondaryBlackButton: white,
  secondaryBlackHover: gray800,
  secondaryBlackShadow: '#3B3A3A',
  primaryFocused: '#4ACD97',
  testNetLabel: 'rgba(247, 144, 9, 0.10)',
  ledgerStep: gray600,
  ledgerWalletStep: 'rgba(2, 168, 99, 0.20)',
  rejected: 'rgba(240, 68, 56, 0.10)',
  rejectedBorder: error500,
  destructiveSecondaryShadow: '#43302F',
  transparent: 'transparent',
  signedSignature: green500,
  black,
  subtleBlack,
  white,
  subtleWhite,
  lightBlack,
  radioButton: green600,

  green50,
  green100,
  green200,
  green500,
  green600,
  green650,
  green700,
  green800,
  green900,
  green950,

  gray25,
  gray50,
  gray100,
  gray200,
  gray300,
  gray400,
  gray500,
  gray600,
  gray700,
  gray800,
  gray900,

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
