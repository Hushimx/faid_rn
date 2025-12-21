import { createBox, createText, createTheme } from '@shopify/restyle';

const COLORS = {
  primary: 'rgba(35, 68, 205, 1)',
  white: 'white',
  grayLight: 'rgba(233, 237, 242, 1)',
  grayDark: 'rgba(70, 79, 103, 0.6)',
  red: '#f00',
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
      fontSize: 30,
      fontWeight: '700',
    },
    h2: {
      fontSize: 28,
      fontWeight: '700',
    },
    h3: {
      fontSize: 26,
      fontWeight: '700',
    },
    h4: {
      fontSize: 24,
      fontWeight: '700',
    },
    h5: {
      fontSize: 22,
      fontWeight: '700',
    },
    h6: {
      fontSize: 20,
      fontWeight: '700',
    },
    m: {
      fontSize: 18,
      fontWeight: '700',
    },
    s1: {
      fontSize: 17,
      fontWeight: '500',
    },
    s2: {
      fontSize: 14,
      fontWeight: '400',
    },
    s3: {
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
