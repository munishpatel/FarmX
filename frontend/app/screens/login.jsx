import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from "react-native";
import { useRouter } from "expo-router";
import { colors } from "../../utils/colors";
import { fonts } from "../../utils/fonts";
import GradientBackground from "../../components/gradient"; // Import GradientBackground

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:5001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        Alert.alert("Success", "Login Successful");
        router.push("/screens/landingpage"); // Navigate to landing page after login
      } else {
        Alert.alert("Error", data.message);
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong");
    }
  };

  return (
    <GradientBackground>
      <View style={styles.contentContainer}>
        <View style={styles.textContainer}>
          <Text style={[styles.headingText, { color: '#FF9800' }]}>Hey,</Text>
          <Text style={[styles.headingText, { color: '#fff' }]}>Welcome</Text>
          <Text style={styles.headingText}>Back!!</Text>
        </View>
        <Text style={styles.title}>Enter your details:</Text>
        <TextInput placeholder="Email" style={styles.input} value={email} onChangeText={setEmail} placeholderTextColor="#666666" />
        <TextInput placeholder="Password" secureTextEntry style={styles.input} value={password} onChangeText={setPassword} placeholderTextColor="#666666" />
        <TouchableOpacity>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <Text style={styles.continueText}>or continue with</Text>
          <TouchableOpacity style={styles.googleButtonContainer}>
            <Image source={require("../../assets/images/google.png")}
              style={styles.googleImage}
            />
            <Text style={styles.googleText}>Google</Text>
          </TouchableOpacity>
          <View style={styles.footerContainer}>
            <Text style={styles.accountText}>Dont have an account?</Text>
            <TouchableOpacity onPress={() => router.push("/screens/signup")}>
              <Text style={styles.signupText}>Sign up</Text>
            </TouchableOpacity>
          </View>
      </View>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 30,
    marginBottom: 5,
    marginTop: 0,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderRadius: 100,
    borderColor: colors.primary,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    padding: 2,
    marginVertical: 10,
    height: 50,
  },
  button: {
    backgroundColor: "#388E3C",
    paddingVertical: 15,
    borderRadius: 100,
    alignItems: "center",
    marginTop: 15,
  },
  buttonText: {
    color: "#fff",
    fontSize: 25,
    fontWeight: "600",
  },
  textContainer: {
    marginTop: -100,
    marginBottom: 50,
  },
  headingText: {
    fontSize: 32,
    fontFamily: fonts.SemiBold,
    color: "#2E7D32",
  },
  forgotPasswordText: {
    textAlign: "right",
    marginVertical: 10,
  },
  continueText: {
    textAlign: "center",
    marginVertical: 20,
    fontSize: 14,
    fontFamily: fonts.Regular,
    color: colors.primary,
  },
  googleButtonContainer: {
    flexDirection: "row",
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    gap: 10,
  },
  googleImage: {
    height: 20,
    width: 20,
  },
  googleText: {
    fontSize: 20,
    fontFamily: fonts.SemiBold,
  },
  footerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
    gap: 5,
  },
  accountText: {
    color: colors.primary,
    fontFamily: fonts.Regular,
  },
  signupText: {
    color: colors.primary,
    fontFamily: fonts.Bold,
  },
});