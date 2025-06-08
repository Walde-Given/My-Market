
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    const timeout = setTimeout(() => {
      navigation.replace('Login'); // Navigate to Login after 2 seconds
    }, 4000);

    return () => clearTimeout(timeout);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/Logo.jpg')} 
        style={styles.logo}
      />
      <Text style={styles.appName}>MY MARKET™️</Text>
      <Text style={styles.publisher}>By: Appstics</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  logo: {
    width: 400,
    height: 400,
    marginBottom: 60,
  },
  appName: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 30,
  },
  publisher: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    fontSize: 14,
    color: '#4d4d4d',
  },
});
