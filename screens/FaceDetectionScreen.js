import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Toast from "react-native-toast-message";
import FaceScanner from "../components/FaceScanner";
import colors from "../styles/colors";

const FaceDetectionScreen = ({ route, navigation }) => {
  const staffId = route.params;
  const handleFaceDetected = (response) => {
    if (response.message === "Face recognized") {
      navigation.replace("VerificationScreen", response.staff);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Face Detection</Text>
      <FaceScanner staffId={staffId} onFaceDetected={handleFaceDetected} />
      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: colors.background,
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 20,
  },
});

export default FaceDetectionScreen;
