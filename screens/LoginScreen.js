import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
} from "react-native";
import Toast from "react-native-toast-message";

import { removeUserSession, storeUserSession } from "../utils/AuthUtils";
import { login } from "../api/requests";
import colors from "../styles/colors";

const LoginScreen = ({ navigation }) => {
  const [staffId, setStaffId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (staffId && password) {
      setLoading(true);
      try {
        const { staff } = await login(staffId, password);
        await removeUserSession();
        await storeUserSession({ staffId: staff.id });

        Toast.show({
          text1: "Login Success",
          text2: "You have successfully logged in",
          type: "success",
        });

        setTimeout(() => {
          navigation.replace("FaceWelcomeScreen", staffId);
        }, 2000);
      } catch (error) {
        console.error(error);
        Toast.show({
          text1: "Login Failed",
          text2: error.message,
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    } else {
      Toast.show({
        text1: "Login Failed",
        text2: "Please enter both Staff ID and password",
        type: "error",
      });
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require("../assets/gacl_logo.png")} style={styles.logo} />
      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.subtitle}>Please log in to continue</Text>
      <TextInput
        style={styles.input}
        placeholder="Staff ID"
        placeholderTextColor={colors.lightGray}
        value={staffId}
        onChangeText={setStaffId}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor={colors.lightGray}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color={colors.white} />
        ) : (
          <Text style={styles.buttonText}>Log In</Text>
        )}
      </TouchableOpacity>
      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: "center",
    paddingHorizontal: 24,
    backgroundColor: colors.background,
  },
  logo: {
    width: 150,
    height: 150,
    alignSelf: "center",
    marginBottom: 20,
    resizeMode: "contain"
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.primary,
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: colors.darkGray,
    marginBottom: 32,
    textAlign: "center",
  },
  input: {
    height: 50,
    borderColor: colors.lightGray,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 16,
    color: colors.black,
    backgroundColor: colors.inputBackground,
  },
  button: {
    height: 50,
    backgroundColor: colors.primary,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonDisabled: {
    backgroundColor: colors.lightGray,
  },
  buttonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "600",
  },
});

export default LoginScreen;
