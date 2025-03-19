import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Link } from 'expo-router';
import GradientBackground from '../../components/gradient'; 

export default function HomeScreen() {
  return (
    <GradientBackground>
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
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1, // Added flex: 1 to fill the gradient container
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center', // Added to center vertically
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  button: {
    width: 250,
    paddingVertical: 15,
    backgroundColor: '#388E3C',
    borderRadius: 50,
    alignItems: 'center',
    marginBottom: 15,
  },
  signupButton: {
    width: 250,
    paddingVertical: 15,
    backgroundColor: '#FF9800',
    borderRadius: 50,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
  },
  logo: {
    width: 331,
    height: 350,
    marginVertical: 20,
  },
});