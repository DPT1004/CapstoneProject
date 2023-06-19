import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import { COLORS } from '../../../common/theme';

const THUMB_RADIUS_LOW = 30;
const THUMB_RADIUS_HIGH = 16;

const Thumb = ({ name }) => {
  return <View style={name === 'high' ? styles.rootHigh : styles.rootLow} />;
};

const styles = StyleSheet.create({
  rootLow: {
    width: THUMB_RADIUS_LOW * 1 / 2,
    height: THUMB_RADIUS_LOW,
    borderRadius: 1,
    // borderWidth: 2,
    // borderColor: COLORS.gray,
    backgroundColor: COLORS.black,
  },
  rootHigh: {
    width: THUMB_RADIUS_HIGH * 2,
    height: THUMB_RADIUS_HIGH * 2,
    // borderRadius: THUMB_RADIUS_HIGH,
    // borderWidth: 2,
    // borderColor: COLORS.gray,
    backgroundColor: COLORS.white,
  },
});

export default memo(Thumb);
