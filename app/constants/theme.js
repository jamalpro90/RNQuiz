import {Dimensions} from 'react-native';
const {width, height} = Dimensions.get('window');

export const COLORS = {
  primary: '#252c4a',
  secondary: '#1E90ff',
  accent: '#3498db',

  success: '#00c851',
  error: '#ff4444',

  black: '#171717',
  white: '#ffffff',
  background: '#252c4a',
};

export const SIZES = {
  base: 10,
  width,
  height,
};
