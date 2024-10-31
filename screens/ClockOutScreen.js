import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal } from "react-native";
import LottieView from "lottie-react-native";
import colors from "../styles/colors";
import { editAttendance } from "../api/requests";
import Toast from "react-native-toast-message";

const ClockOutScreen = ({ route, navigation }) => {
  const [isClockingOut, setIsClockingOut] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [workDuration, setWorkDuration] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  console.log(route.params)
  
  const { attendance_id, clockin_time } = route.params.attendance;

  useEffect(() => {
    const clockInDate = new Date(`1970-01-01T${clock_in}Z`);
    const duration = calculateDuration(clockInDate);
    setWorkDuration(duration);

    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, [clock_in]);

  const calculateDuration = (clockIn) => {
    const now = new Date();
    const diffInMs = now - clockIn;

    const hours = Math.floor(diffInMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffInMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const handleClockOut = () => {
    setModalVisible(true);
  };

  const confirmClockOut = async () => {
    setIsClockingOut(true);
    const clockOutTime = currentTime.toLocaleTimeString();

    try {
      await editAttendance(attendance_id, clockOutTime);
      Toast.show({
        text1: "Success",
        text2: "You have clocked out successfully!",
        type: "success",
      });
      setTimeout(() => navigation.navigate("LoginScreen"), 2000);
    } catch (error) {
      Toast.show({
        text1: "Error",
        text2: "There was an issue clocking you out. Please try again.",
        type: "error",
      });
    } finally {
      setIsClockingOut(false);
      setModalVisible(false);
    }
  };

  return (
    <View style={styles.container}>
      <LottieView
        source={require("../assets/animations/clock-out.json")}
        autoPlay
        loop
        style={styles.lottie}
      />
      <Text style={styles.title}>Clock Out Time!</Text>
      <Text style={styles.subtitle}>You're almost done for the day!</Text>

      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>Current Time: {currentTime.toLocaleTimeString()}</Text>
        <Text style={styles.infoText}>Date: {currentTime.toLocaleDateString()}</Text>
        <Text style={styles.infoText}>Duration Worked: {workDuration}</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleClockOut} disabled={isClockingOut}>
        <Text style={styles.buttonText}>{isClockingOut ? "Processing..." : "Clock Out"}</Text>
      </TouchableOpacity>

      <Modal transparent={true} visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirm Clock Out</Text>
            <Text style={styles.modalText}>Are you sure you want to clock out?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.confirmButton} onPress={confirmClockOut}>
                <Text style={styles.buttonText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.buttonText}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
    backgroundColor: colors.background,
  },
  lottie: {
    width: 150,
    height: 150,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.primary,
    marginTop: 20,
  },
  subtitle: {
    fontSize: 18,
    color: colors.darkGray,
    textAlign: "center",
    marginBottom: 20,
  },
  infoContainer: {
    backgroundColor: colors.lightGray,
    borderRadius: 15,
    padding: 20,
    marginVertical: 30,
    alignItems: "center",
    width: "90%",
    elevation: 5,
  },
  infoText: {
    fontSize: 16,
    color: colors.black,
    fontWeight: "500",
    marginVertical: 5,
  },
  button: {
    height: 55,
    width: "80%",
    backgroundColor: colors.secondary,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
  },
  buttonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "600",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    elevation: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    color: colors.primary,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  confirmButton: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    height: 45,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: colors.lightGray,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
    height: 45,
  },
});

export default ClockOutScreen;
