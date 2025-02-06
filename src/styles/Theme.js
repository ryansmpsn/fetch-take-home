const size = {
  mobileS: '320px',
  mobileM: '375px',
  mobileL: '425px',
  tablet: '768px',
  laptop: '1024px',
  laptopL: '1440px',
  desktop: '2560px'
};

const device = {
  mobileS: `(max-width: ${size.mobileS})`,
  mobileM: `(max-width: ${size.mobileM})`,
  mobileL: `(max-width: ${size.mobileL})`,
  tablet: `(max-width: ${size.tablet})`,
  laptop: `(max-width: ${size.laptop})`,
  laptopL: `(max-width: ${size.laptopL})`,
  desktop: `(max-width: ${size.desktop})`
};

const colors = {
  lightborder: '#dee2e6',
  danger: '#dc3545',
  muted: '#4c4c4c',
  black: '#000',
  white: '#fff',

  text: '#363537',
  background: '#FFF',
  foreground: '#dcdcdc',
  anotherPurple: '#230871',
  blue: '#007bff',
  indigo: '#6610f2',
  violet: '#510359',
  pink: '#ed6a7c',
  red: '#dc3545',
  orange: '#ffa900',
  yellow: '#ffdf02',
  green: '#04833e',
  teal: '#17799f',
  cyan: '#17a2b8',
  gray: '#ced4da',
  graydark: '#343a40;',
  graylight: '#f1ece9',
  blackdark: '#000',
  darkpurple: '#300d38',
  lightpurple: '#890a74',
  bluepurple: '#6d62dd',
  hotpink: '#f90075',
  graypurple: '#c7c1e0',
  darkgray: '#9ca3af',
  skyblue: '#e5faff',
  darkskyblue: '#ade7f5',
  primary: '#300d38',
  secondary: '#890a74',
  tertiary: '#ffa900',
  quaternary: '#ffdf02',
  links: '#6d62dd',
  success: '#04833e',
  info: '#17a2b8',
  warning: '#ffdf02',
  focus: '#99d9f0',
  light: '#f8f9fa',
  dark: '#343a40'
};

export const defaultTheme = {
  colors: colors,
  device: device
};
