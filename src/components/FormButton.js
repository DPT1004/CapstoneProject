import React from 'react'
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native'
import { COLORS } from '../common/theme'
import { img } from '../assets/index'
import Lottie from "lottie-react-native"


const FormButton = ({
  labelText = '',
  handleOnPress = null,
  style,
  isPrimary = true,
  isLoading = false,
  children,
  ...more
}) => {
  return (
    <TouchableOpacity
      style={{
        backgroundColor: isPrimary ? COLORS.primary : COLORS.white,
        borderWidth: 1,
        borderColor: COLORS.primary,
        borderRadius: 5,
        height: 45,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        ...style,
      }}
      disabled={isLoading}
      activeOpacity={0.6}
      onPress={handleOnPress}
      {...more}>
      {
        isLoading ?
          <Lottie
            source={img.loadingWhite}
            autoPlay
            style={{ flex: 1 }} />
          :
          <>
            {children}
            <Text
              style={{
                marginVertical: 10,
                textAlign: 'center',
                fontSize: 18,
                color: isPrimary ? COLORS.white : COLORS.primary,
              }}>
              {labelText}
            </Text>
          </>
      }
    </TouchableOpacity>
  );
};

export default FormButton;
