import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Link } from 'expo-router';
import { useNavigation } from "@react-navigation/native";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Image source={require('../../assets/images/logo.png')} style={styles.logo} />
      <Text style={styles.title}>Welcome to My App!</Text>

      {/* Login Button */}
      <Link href="/screens/login" asChild>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </Link>

      {/* Signup Button */}
      <Link href="/screens/signup" asChild>
        <TouchableOpacity style={styles.signupButton}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
      </Link>
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
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 40,
  },
  button: {
    width: 250,
    paddingVertical: 15,
    backgroundColor: '#007AFF', // Blue for Login
    borderRadius: 50,
    alignItems: 'center',
    marginBottom: 15,
  },
  signupButton: {
    width: 250,
    paddingVertical: 15,
    backgroundColor: '#34C759', // Very obvious color for testing
    borderRadius: 50,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  logo: {
    width: 331,
    height: 350,
    marginVertical: 20,
  },
});