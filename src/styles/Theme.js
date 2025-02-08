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
  black: '#000',
  danger: '#D83126',
  gray: '#888585',
  graydark: '#404040;',
  graylight: '#D8D8D8',
  lightborder: '#DEE2E6',
  muted: '#4c4c4c',
  primary: '#FF8845',
  quaternary: '#FFF3D9',
  secondary: '#FFBF28',
  tertiary: '#FFF3EC',
  text: '#000',
  textgray: '#46311F',
  white: '#fff'
};

export const defaultTheme = {
  colors: colors,
  device: device
};
