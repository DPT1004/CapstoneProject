import { Dimensions } from 'react-native';
const windowWidth = Dimensions.get('window').width
const windowHeight = Dimensions.get('window').height

export const COLORS = {
  primary: '#4630EB',
  secondary: '#000020',
  bgrForPrimary: "#E1E2FF",

  success: '#72FF0D',
  error: '#FF001B',
  blue: "#12B391",
  blue1: "#0DFFCD",

  answerA: "#e31a3c",
  answerB: "#1267ce",
  answerC: "#d79d00",
  answerD: "#26890c",

  black: '#171717',
  white: '#FFFFFF',
  background: '#f4f4f4',
  backgroundTopBar: '#eaeaea',
  border: '#F5F5F7',
  gray: "#dee1e6"
};

export const SIZES = {
  base: 10,
  windowWidth,
  windowHeight,
};
