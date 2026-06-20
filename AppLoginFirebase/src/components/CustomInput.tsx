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
    borderWidth: 2,
    borderColor: '#333333', // Borda cinza
    borderRadius: 4,
    padding: 16,
    marginBottom: 15,
    backgroundColor: '#121214', // Fundo levemente mais claro que a tela
    color: '#FFFFFF', // Cor do texto que o usuário digita (Branco)
    fontSize: 16,
    fontWeight: 'bold',
  }
});