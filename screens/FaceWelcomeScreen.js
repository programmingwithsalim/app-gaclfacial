import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { Button } from "react-native-paper";
import colors from "../styles/colors";

const FaceWelcomeScreen = ({ route, navigation }) => {
  const staffId = route.params

  return (
    <View style={styles.container}>
      <Text style={styles.title}>GACL Facial</Text>
      <Text style={styles.subtitle}>
        Scan your face to verify your identity.
      </Text>

      <View style={styles.faceContainer}>
        <Image source={require("../assets/face.jpg")} style={styles.faceIcon} />
      </View>

      <Button
        mode="contained"
        onPress={() => navigation.navigate("FaceDetectionScreen", staffId)}
        style={styles.button}
      >
        Start
      </Button>

      <Text style={styles.footer}>
        We will automatically detect the face
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 24,
    paddingTop: 50,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 8,
    color: colors.primary,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: colors.darkGray,
    marginBottom: 20,
    textAlign: "center",
  },
  faceContainer: {
    width: "80%",
    height: 300,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: colors.lightGray,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: colors.inputBackground,
    elevation: 1,
  },
  faceIcon: {
    width: 180,
    height: 180,
    opacity: 0.5,
  },
  button: {
    width: "90%",
    backgroundColor: colors.primary,
    borderRadius: 10,
    height: 55,
    justifyContent: "center",
    marginTop: 30,
    elevation: 3,
  },
  footer: {
    marginTop: 10,
    fontSize: 14,
    color: colors.darkGray,
    textAlign: "center",
  },
});

export default FaceWelcomeScreen;
