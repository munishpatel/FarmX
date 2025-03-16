import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function LandingPage() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to the Landing Page!</Text>
      <Text style={styles.subtitle}>You are now logged in.</Text>
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
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    color: '#555',
  },
});
