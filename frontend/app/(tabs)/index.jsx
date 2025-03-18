import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Link } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient'; // Use expo-linear-gradient

export default function HomeScreen() {
  return (
    <LinearGradient
      colors={['#4CAF50', '#E8F5E9']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.gradientContainer}
    >
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Welcome to My App!</Text>
        <Image source={require('../../assets/images/farmr.png')} style={styles.logo} />

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
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    width: '100%',
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  button: {
    width: 250,
    paddingVertical: 15,
    backgroundColor: '#007AFF',
    borderRadius: 50,
    alignItems: 'center',
    marginBottom: 15,
  },
  signupButton: {
    width: 250,
    paddingVertical: 15,
    backgroundColor: '#34C759',
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
