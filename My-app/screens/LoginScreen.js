
import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const LoginScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>MY MARKET™️</Text>

      <Text style={styles.label}>EMAIL</Text>
      <TextInput style={styles.input} placeholder="Enter email" keyboardType="email-address" />

      <Text style={styles.label}>PASSWORD</Text>
      <TextInput style={styles.input} placeholder="Enter password" secureTextEntry />

      <TouchableOpacity style={styles.loginButton}>
        <Text style={styles.loginText}>LOG IN</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => {}}>
        <Text style={styles.link}>FORGOT PASSWORD?</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
        <Text style={styles.link}>SIGN UP</Text>
      </TouchableOpacity>

      {/* Test run button */}
      <TouchableOpacity onPress={() => navigation.navigate('Home')}>
        <Text style={styles.testText}>
          (test run) press here to skip login and signup because it is not set up
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;

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
  loginButton: {
    backgroundColor: '#1e90ff',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  loginText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  link: {
    color: '#1e90ff',
    textAlign: 'center',
    marginTop: 15,
  },
  testText: {
    marginTop: 25,
    color: '#888',
    fontSize: 13,
    textAlign: 'center',
  },
});
