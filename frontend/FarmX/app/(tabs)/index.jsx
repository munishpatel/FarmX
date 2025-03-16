import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Link } from 'expo-router';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
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
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  signupButton: {
    width: 250,
    paddingVertical: 15,
    backgroundColor: '#34C759', // Very obvious color for testing
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});