import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image, KeyboardAvoidingView, Platform } from "react-native";
import { useRouter } from "expo-router";
import { colors } from "../../utils/colors";
import { fonts } from "../../utils/fonts";
import GradientBackground from "../../components/gradient";

export default function SignupScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isFocusedName, setIsFocusedName] = useState(false);
  const [isFocusedEmail, setIsFocusedEmail] = useState(false);
  const [isFocusedPassword, setIsFocusedPassword] = useState(false);
  const router = useRouter();

  const handleSignup = async () => {
    try {
      const response = await fetch("http://localhost:5001/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        Alert.alert("Success", data.message);
        router.push("/screens/login");
      } else {
        Alert.alert("Error", data.message);
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong");
    }
  };

  return (
    <GradientBackground>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <View style={styles.contentContainer}>
          <View style={styles.header}>
            <Text style={styles.welcomeText}>Create Account</Text>
            <Text style={styles.subtitle}>Get started with your journey</Text>
          </View>

          <View style={styles.formContainer}>
            <TextInput
              placeholder="Full Name"
              style={[styles.input, isFocusedName && styles.inputFocused]}
              value={name}
              onChangeText={setName}
              placeholderTextColor={colors.textSecondary}
              onFocus={() => setIsFocusedName(true)}
              onBlur={() => setIsFocusedName(false)}
              autoCapitalize="words"
            />

            <TextInput
              placeholder="Email"
              style={[styles.input, isFocusedEmail && styles.inputFocused]}
              value={email}
              onChangeText={setEmail}
              placeholderTextColor={colors.textSecondary}
              onFocus={() => setIsFocusedEmail(true)}
              onBlur={() => setIsFocusedEmail(false)}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <TextInput
              placeholder="Password"
              style={[styles.input, isFocusedPassword && styles.inputFocused]}
              value={password}
              onChangeText={setPassword}
              placeholderTextColor={colors.textSecondary}
              secureTextEntry
              onFocus={() => setIsFocusedPassword(true)}
              onBlur={() => setIsFocusedPassword(false)}
            />

            <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
              <Text style={styles.signupButtonText}>Sign Up</Text>
            </TouchableOpacity>

            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or continue with</Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity style={styles.socialButton}>
              <Image
                source={require("../../assets/images/google.png")}
                style={styles.socialIcon}
              />
              <Text style={styles.socialButtonText}>Google</Text>
            </TouchableOpacity>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account?</Text>
              <TouchableOpacity onPress={() => router.push("/screens/login")}>
                <Text style={styles.footerLink}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 32,
  },
  welcomeText: {
    fontSize: 28,
    fontFamily: fonts.Bold,
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: fonts.Regular,
    color: colors.textSecondary,
  },
  formContainer: {
    width: '100%',
  },
  input: {
    backgroundColor: colors.gray,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    fontFamily: fonts.Regular,
    color: colors.text,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  inputFocused: {
    borderColor: colors.primary,
    backgroundColor: colors.white,
  },
  signupButton: {
    backgroundColor: colors.secondary, // Using the orange color
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
    elevation: 2,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  signupButtonText: {
    color: colors.white,
    fontFamily: fonts.SemiBold,
    fontSize: 16,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.grayLight,
  },
  dividerText: {
    marginHorizontal: 12,
    color: colors.textSecondary,
    fontFamily: fonts.Regular,
    fontSize: 14,
  },
  socialButton: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.grayLight,
    marginBottom: 24,
  },
  socialIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  socialButtonText: {
    color: colors.text,
    fontFamily: fonts.SemiBold,
    fontSize: 14,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    color: colors.textSecondary,
    fontFamily: fonts.Regular,
    fontSize: 14,
  },
  footerLink: {
    color: colors.black,
    fontFamily: fonts.SemiBold,
    fontSize: 14,
    marginLeft: 4,
  },
});