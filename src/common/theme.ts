import { createBox, createText, createTheme } from '@shopify/restyle';

const FONT_FAMILY = 'Cairo';

const COLORS = {
  primary: 'rgba(35, 68, 205, 1)',
  white: 'white',
  grayLight: 'rgba(233, 237, 242, 1)',
  grayDark: 'rgba(70, 79, 103, 0.6)',
  red: '#f00',
  danger: '#FF3B30',
  warning: '#FF9500',
  success: '#34C759',
  lightBlack: 'rgba(62, 68, 83, 1)',
  primaryLight: 'rgba(35, 68, 205, 0.3)',
  pageBackground: '#f8f8fa',
  cutomBlack: 'rgba(0, 0, 0, 1)',
  customGray: 'rgba(0, 0, 0, 0.5)',
  customGray1: 'rgba(210, 220, 233, 1)',
  customYellow: 'rgba(239, 226, 39, 1)',
  lightBlue: 'rgba(216, 233, 246, 1)',
  purple: 'rgba(205, 213, 247, 1)',
  darkSlateBlue: 'rgba(70, 79, 103, 1)',
};

const SPACING = {
  sss: 2,
  ss: 4,
  s: 8,
  sm: 12,
  m: 16,
  ml: 20,
  l: 24,
  xl: 28,
  xxl: 40,
  gap: 16,
};
const theme = createTheme({
  colors: {
    ...COLORS,
  },
  spacing: SPACING,
  textVariants: {
    h1: {
      fontFamily: FONT_FAMILY,
      fontSize: 30,
      fontWeight: '700',
    },
    h2: {
      fontFamily: FONT_FAMILY,
      fontSize: 28,
      fontWeight: '700',
    },
    h3: {
      fontFamily: FONT_FAMILY,
      fontSize: 26,
      fontWeight: '700',
    },
    h4: {
      fontFamily: FONT_FAMILY,
      fontSize: 24,
      fontWeight: '700',
    },
    h5: {
      fontFamily: FONT_FAMILY,
      fontSize: 22,
      fontWeight: '700',
    },
    h6: {
      fontFamily: FONT_FAMILY,
      fontSize: 20,
      fontWeight: '700',
    },
    m: {
      fontFamily: FONT_FAMILY,
      fontSize: 18,
      fontWeight: '700',
    },
    s1: {
      fontFamily: FONT_FAMILY,
      fontSize: 17,
      fontWeight: '500',
    },
    s2: {
      fontFamily: FONT_FAMILY,
      fontSize: 14,
      fontWeight: '400',
    },
    s3: {
      fontFamily: FONT_FAMILY,
      fontSize: 12,
      fontWeight: '400',
    },
  },
});

export type Theme = typeof theme;
export type Colors = typeof theme.colors;

const Box = createBox<Theme>();
const Text = createText<Theme>();

const useAppTheme = () => theme;

export { COLORS, Box, SPACING, useAppTheme, Text };

export default theme;
