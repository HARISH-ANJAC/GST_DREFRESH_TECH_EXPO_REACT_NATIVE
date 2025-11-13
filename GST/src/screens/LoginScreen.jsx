import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
  ActivityIndicator,
  Dimensions,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
  StatusBar,
  ToastAndroid,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
// Assuming your new colors are in this file
import { COLORS } from "../constants/colors";
// Import the new modern styles
import { styles } from "../styles/ModernLoginStyles";
import { IMAGE } from "../constants/images";
import { validateEmail } from "../Utils/Validator";
import axios from "axios";
import { LOGIN } from "../constants/url";

const { width, height } = Dimensions.get("window");

const LoginScreen = () => {
  const [Email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [Apierror, setApieror] = useState("");
  const [errors, setErrors] = useState({ Email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const navigation = useNavigation();

useEffect(() => {
  (async () => {
    const rememberedUsername = await AsyncStorage.getItem("rememberedUsername");
    const rememberedPassword = await AsyncStorage.getItem("rememberedPassword");

    if (rememberedUsername && rememberedPassword) {
      setEmail(rememberedUsername); // ✅ FIXED
      setPassword(rememberedPassword);
      setRememberMe(true);
    }
  })();
}, []);


const handleLogin = async () => {
  // Reset API error
  setApieror("");

  // 🔍 Validation
  if (!Email.trim() || !password.trim()) {
    setApieror("Email and password are required.");
    ToastAndroid.show("Email and password are required.", ToastAndroid.SHORT);
    return;
  }

  if (!validateEmail(Email)) {
    setErrors((prev) => ({ ...prev, Email: "Please enter a valid email address" }));
    return;
  }

  try {
    setIsLoading(true);

    // 📨 API Call
    const response = await axios.post(LOGIN, {
      email: Email.trim(),
      password: password.trim(),
    });

    console.log("✅ Login Response:", response.data);

    const resData = response.data;

    if (resData.status === "success") {
      // 🎯 Save login data
      const userData = resData.data;

      await AsyncStorage.setItem("userData", JSON.stringify(userData));

      // 📦 Handle Remember Me
      if (rememberMe) {
        await AsyncStorage.setItem("rememberedUsername", Email.trim());
        await AsyncStorage.setItem("rememberedPassword", password.trim());
      }else {
        await AsyncStorage.multiRemove(["rememberedUsername", "rememberedPassword"]);
      }


      ToastAndroid.show("Login successful!", ToastAndroid.SHORT);

      // 🔁 Navigate to your main screen (Dashboard or Home)
      navigation.replace("Home"); // Change "Dashboard" to your actual route name
    } else if (resData.status === "error") {
      // ❌ API error from server
      setApieror(resData.message || "Login failed. Please try again.");
      ToastAndroid.show(resData.message, ToastAndroid.SHORT);
    } else {
      // ⚠️ Unexpected response
      setApieror("Unexpected response. Please try again later.");
      ToastAndroid.show("Unexpected response.", ToastAndroid.SHORT);
    }
  } catch (error) {
    console.log("❌ Login Error:", error.message);
    setApieror("Network error. Please check your connection.");
    ToastAndroid.show("Network error. Please check your connection.", ToastAndroid.SHORT);
  } finally {
    setIsLoading(false);
  }
};


  return (
    <SafeAreaView style={styles.container}>
      {/* Use the new primary color for the status bar */}
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.primary} />
      {/* Dismiss keyboard on outside touch */}
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
          keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
        >
          <ScrollView
            contentContainerStyle={styles.scrollWrapper}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Logo */}
            <Image
              source={IMAGE.Logo}
              style={styles.logo}
              resizeMode="contain"
            />

            {/* Welcome */}
            <Text style={styles.headerTitle}>Welcome Back</Text>
            <Text style={styles.subText}>Login to continue Admin GST</Text>

            {/* Email */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={[styles.input, errors.Email && styles.inputError]}
                placeholder="Enter your Email"
                placeholderTextColor="#9ca3af"
                value={Email}
                onChangeText={(text) => {
                  setEmail(text);
                  setErrors((prev) => ({ ...prev, Email: "" }));
                }}
                autoCapitalize="none"
              />
              {errors.Email ? (
                <Text style={styles.errorText}>{errors.Email}</Text>
              ) : null}
            </View>

            {/* Password */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.passwordWrapper}>
                <TextInput
                  style={[
                    styles.input,
                    errors.password && styles.inputError,
                    { flex: 1, paddingRight: 50 }, // Ensure space for icon
                  ]}
                  placeholder="Enter your password"
                  placeholderTextColor="#9ca3af"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    setErrors((prev) => ({ ...prev, password: "" }));
                  }}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                  activeOpacity={0.7}
                >
                  <FontAwesome
                    name={showPassword ? "eye" : "eye-slash"}
                    size={22}
                    // Use the new accent color
                    color={COLORS.primary}
                  />
                </TouchableOpacity>
              </View>
              {errors.password ? (
                <Text style={styles.errorText}>{errors.password}</Text>
              ) : null}
            </View>

            {/* Remember Me */}
            <View style={styles.rememberContainer}>
              <TouchableOpacity
                onPress={() => setRememberMe(!rememberMe)}
                style={styles.checkbox}
                activeOpacity={0.7}
              >
                <FontAwesome
                  name={rememberMe ? "check-square" : "square-o"}
                  size={24}
                  // Use the new primary color
                  color={COLORS.primary}
                />
              </TouchableOpacity>
              <Text style={styles.rememberText}>Remember Me</Text>
            </View>

            {/* Api Error */}
            {/* Use the new dedicated style for API errors */}
            {Apierror ? <Text style={styles.apiErrorText}>{Apierror}</Text> : null}

            {/* Login Button */}
            <TouchableOpacity
              style={styles.button}
              onPress={handleLogin}
              activeOpacity={0.85}
              disabled={isLoading} // Disable button when loading
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Login</Text>
              )}
            </TouchableOpacity>

            {/* Footer */}
            <Text style={styles.footerText}>
              © 2025 D Refresh Tech | All rights reserved
            </Text>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default LoginScreen;
