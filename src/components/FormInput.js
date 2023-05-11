import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { COLORS } from '../common/theme';

const FormInput = ({
  labelText = '',
  placeholderText = '',
  onChangeText = null,
  value = "",
  maxLength = 65,
  showCharCount = false,
  multiline = true,
  children,
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
      <View style={styles.viewTxtInput}>
        <TextInput
          style={styles.txtInput}
          selectionColor={COLORS.primary}
          placeholder={placeholderText}
          onChangeText={onChangeText}
          value={value.replace(/\s/g, '')}
          maxLength={maxLength}
          multiline={multiline}
          {...more}
        />
        {children}
      </View>
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
  viewTxtInput: {
    paddingHorizontal: 8,
    borderColor: COLORS.black + 20,
    width: '100%',
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 10,
  },
  txtLabel: {
    fontSize: 15,
  },
  txtInput: {
    fontSize: 16
  }
})

export default React.memo(FormInput)
