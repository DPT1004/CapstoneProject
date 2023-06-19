import React, { memo } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { COLORS } from '../../../common/theme'

const Rail = () => {
  return (
    <View style={styles.root}>
      <Text style={styles.txtStartTime}>Start Time</Text>
      <Text style={styles.txtEndTime}>End Time</Text>
    </View>
  );
};

export default memo(Rail);

const styles = StyleSheet.create({
  root: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.gray,
  },
  txtStartTime: {
    position: "absolute",
    left: 0,
    bottom: -20,
    fontSize: 8,
    color: COLORS.black,
    fontWeight: "600"
  },
  txtEndTime: {
    position: "absolute",
    right: 0,
    bottom: -20,
    fontSize: 8,
    color: COLORS.black,
    fontWeight: "600"
  }
});
