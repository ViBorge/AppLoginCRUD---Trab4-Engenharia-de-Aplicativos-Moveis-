import React from 'react';
import { TextInput, StyleSheet, TextInputProps } from 'react-native';

interface CustomInputProps extends TextInputProps {}

export function CustomInput(props: CustomInputProps) {
  return (
    <TextInput 
      style={styles.input} 
      placeholderTextColor="#888"
      {...props} 
    />
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
  },
});