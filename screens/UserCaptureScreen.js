import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ImageBackground,
} from "react-native";
import { Camera } from "expo-camera";
import * as FileSystem from "expo-file-system";
import axios from "axios";

const UserCaptureScreen = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleFormSubmit = () => {
    if (formData.name && formData.email && formData.phone) {
      setStep(2);
    } else {
      Alert.alert("Error", "Please fill out all the fields.");
    }
  };

  const captureFace = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync({
        base64: true,
      });

      try {
        const response = await addStaff({
          ...formData,
          imageUri: photo.uri,
        });

        if (response.data.success) {
          Alert.alert("Success", response.data.message);
        } else {
          Alert.alert("Error", response.data.error || "Failed to register staff");
        }
      } catch (error) {
        console.error("Error registering staff:", error);
        Alert.alert("Error", "Failed to register staff");
      }
    }
  };

  const addStaff = async (staffData) => {
    const base64Image = await FileSystem.readAsStringAsync(staffData.imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const response = await axios.post("http://192.168.85.71:5000/staff", {
      staff_id: generateStaffID(),
      full_name: staffData.name,
      email: staffData.email,
      phone: staffData.phone,
      face_image: base64Image,
      password: "defaultPassword123",
    });

    return response;
  };

  const generateStaffID = () => {
    return `STAFF-${Math.floor(Math.random() * 10000)}`;
  };

  if (hasPermission === null) {
    return <Text style={styles.loadingText}>Requesting camera permission...</Text>;
  }

  if (hasPermission === false) {
    return <Text style={styles.errorText}>No access to camera</Text>;
  }

  return (
    <ImageBackground 
      // source={require('./path/to/your/background-image.jpg')} 
      style={styles.background}
    >
      <View style={styles.container}>
        {step === 1 ? (
          <View style={styles.formContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter your name"
              placeholderTextColor="#888"
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor="#888"
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter your phone number"
              placeholderTextColor="#888"
              value={formData.phone}
              onChangeText={(text) => setFormData({ ...formData, phone: text })}
            />
            <TouchableOpacity style={styles.button} onPress={handleFormSubmit}>
              <Text style={styles.buttonText}>Next: Capture Face</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.cameraContainer}>
            <Camera style={styles.camera} type={Camera.Constants.Type.front} ref={cameraRef} />
            <TouchableOpacity style={styles.button} onPress={captureFace}>
              <Text style={styles.buttonText}>Capture Face</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
  },
  formContainer: {
    width: "100%",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  input: {
    width: "100%",
    padding: 15,
    borderWidth: 1,
    borderColor: "#00FF88",
    borderRadius: 10,
    backgroundColor: "#f9f9f9",
    marginBottom: 10,
    fontSize: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cameraContainer: {
    width: "100%",
    height: "60%",
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 20,
  },
  camera: {
    flex: 1,
  },
  button: {
    backgroundColor: "#00FF88",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    elevation: 2,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  loadingText: {
    color: "#fff",
    fontSize: 18,
  },
  errorText: {
    color: "#ff4d4d",
    fontSize: 18,
  },
});

export default UserCaptureScreen;
