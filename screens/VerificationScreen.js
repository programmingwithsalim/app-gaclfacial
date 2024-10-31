import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import LottieView from "lottie-react-native";
import { Audio } from "expo-av";
import Toast from "react-native-toast-message";

import colors from "../styles/colors";
import { takeAttendance } from "../api/requests";

const VerificationScreen = ({ route, navigation }) => {
  const [sound, setSound] = useState();
  const staff = route.params;

  useEffect(() => {
    (async () => {
      const { sound } = await Audio.Sound.createAsync(
        require("../assets/sounds/scan-success.mp3")
      );
      setSound(sound);
    })();
  }, []);

  const getFormattedDateTime = () => {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");

    return {
      formattedDate: `${year}-${month}-${day}`,
      formattedTime: `${hours}:${minutes}`,
    };
  };

  const handleContinue = async () => {
    const { formattedDate, formattedTime } = getFormattedDateTime();

    try {
      const response = await takeAttendance(
        staff.staff_id,
        formattedTime,
        null,
        formattedDate
      );
      showToast(response);

      setTimeout(
        () =>
          navigation.replace("ClockOutScreen", {
            clockin_time: formattedTime,
            attendance_id: response.attendance_id,
          }),
        2000
      );
    } catch (response) {
      const existing_attendance = response.attendance;
      showToast(response);
      setTimeout(
        () =>
          navigation.replace("ClockOutScreen", {
            attendance: existing_attendance,
            clockin_time: formattedTime,
          }),
        2000
      );
    }
  };

  const playSound = async () => {
    await sound.playAsync();
  };

  const showToast = (response) => {
    const message =
      response.message === "Attendance record added successfully."
        ? {
            text1: "Success",
            text2: `${response.message}!`,
            type: "success",
          }
        : { text1: "Error", text2: response.message, type: "error" };

    Toast.show({
      ...message,
      position: "top",
      visibilityTime: 4000,
      autoHide: true,
    });
  };

  return (
    <View style={styles.container}>
      <LottieView
        source={require("../assets/animations/success.json")}
        autoPlay
        loop={false}
        style={styles.lottie}
        onAnimationFinish={playSound}
      />
      <Text style={styles.title}>{staff.name}</Text>
      <Text style={styles.subtitle}>
        Identity Verified, you’re officially you!
      </Text>
      <TouchableOpacity
        style={styles.button}
        onPress={handleContinue}
        accessibilityLabel="Continue to Clock Out Screen"
      >
        <Text style={styles.buttonText}>Clock In</Text>
      </TouchableOpacity>
      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    alignItems: "center",
    backgroundColor: colors.background,
    paddingHorizontal: 20,
  },
  lottie: {
    width: 250,
    height: 250,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.primary,
    marginVertical: 16,
  },
  subtitle: {
    fontSize: 18,
    color: colors.darkGray,
    textAlign: "center",
    marginBottom: 32,
  },
  button: {
    height: 55,
    width: "80%",
    backgroundColor: colors.primary,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
  },
  buttonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "600",
  },
});

export default VerificationScreen;
