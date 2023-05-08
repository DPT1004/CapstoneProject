import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { COLORS } from '../common/theme';

const FormInput = ({
  labelText = '',
  placeholderText = '',
  onChangeText = null,
  value = "",
  maxLength = 75,
  showCharCount = false,
  multiline = true,
  ...more
}) => {
  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row" }}>
        <Text style={styles.txtLabel}>{labelText}</Text>
        <View style={styles.viewFlex1} />
        {
          showCharCount ?
            <Text>{value.length + "/" + maxLength}</Text>
            :
            <></>
        }
      </View>
      <TextInput
        style={styles.txtInput}
        selectionColor={COLORS.primary}
        placeholder={placeholderText}
        onChangeText={onChangeText}
        value={value}
        maxLength={maxLength}
        multiline={multiline}
        {...more}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 20
  },
  viewFlex1: {
    flex: 1
  },
  txtLabel: {
    fontSize: 15,
  },
  txtInput: {
    padding: 10,
    borderColor: COLORS.black + 20,
    borderWidth: 1,
    width: '100%',
    borderRadius: 5,
    marginTop: 10,
  }
})

export default FormInput;
