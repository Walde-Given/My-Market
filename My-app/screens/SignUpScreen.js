

import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const SignUpScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>MY MARKET™️</Text>

      <Text style={styles.label}>EMAIL</Text>
      <TextInput style={styles.input} placeholder="Enter email" keyboardType="email-address" />

      <Text style={styles.label}>PASSWORD</Text>
      <TextInput style={styles.input} placeholder="Enter password" secureTextEntry />

      <Text style={styles.label}>FULL NAME</Text>
      <TextInput style={styles.input} placeholder="Enter full name" />

      <TouchableOpacity style={styles.signUpButton}>
        <Text style={styles.signUpText}>SIGN UP</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>ALREADY HAVE AN ACCOUNT</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  logo: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 50,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    marginTop: 5,
  },
  signUpButton: {
    backgroundColor: '#1e90ff',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  signUpText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  link: {
    color: '#1e90ff',
    textAlign: 'center',
    marginTop: 15,
  },
});
