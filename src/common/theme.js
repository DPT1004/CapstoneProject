import { Dimensions } from 'react-native';
const windowWidth = Dimensions.get('window').width
const windowHeight = Dimensions.get('window').height

export const COLORS = {
  primary: '#4630EB',
  secondary: '#000020',

  success: '#00C851',
  error: '#ff4444',

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
