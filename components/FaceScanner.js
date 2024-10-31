import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, Vibration } from "react-native";
import { Camera } from "expo-camera";
import { BarIndicator } from "react-native-indicators";
import { Audio } from "expo-av";
import { verifyFace } from "../api/requests";
import Toast from "react-native-toast-message";
import colors from "../styles/colors";

const FaceScanner = ({ onFaceDetected, staffId }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [faceDetected, setFaceDetected] = useState(false);
  const cameraRef = useRef(null);
  const soundRef = useRef();
  const [faces, setFaces] = useState([]);

  useEffect(() => {
    const initializeCamera = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
      soundRef.current = await Audio.Sound.createAsync(
        require("../assets/sounds/scan-success.mp3")
      );
    };

    initializeCamera();
  }, []);

  const handleFacesDetected = async ({ faces }) => {
    setFaces(faces);
    if (faces.length > 0) {
      setFaceDetected(true);
      if (!isScanning) {
        await takePicture();
      }
    } else {
      setFaceDetected(false);
    }
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      setIsScanning(true);
      Vibration.vibrate();

      const picture = await cameraRef.current.takePictureAsync({
        base64: true,
      });

      try {
        const response = await verifyFace(picture.base64, staffId);
        showToast(response);
        onFaceDetected(response);
      } catch (error) {
        console.log(error);
        showToast({ error: error.message });
      }

      setIsScanning(false);
    }
  };

  const showToast = (response) => {
    const message =
      response.message === "Face recognized"
        ? {
            text1: "Success",
            text2: `Welcome, ${response.staff.name}!`,
            type: "success",
          }
        : { text1: "Error", text2: response.error, type: "error" };

    Toast.show({
      ...message,
      position: "top",
      visibilityTime: 4000,
      autoHide: true,
    });
  };

  if (hasPermission === null) {
    return <LoadingText text="Requesting camera permission..." />;
  }

  if (hasPermission === false) {
    return <LoadingText text="No access to camera" />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.cameraContainer}>
        <Camera
          style={styles.camera}
          type={Camera.Constants.Type.front}
          ref={cameraRef}
          onFacesDetected={handleFacesDetected}
        >
          {faces.map((face, index) => (
            <View
              key={index}
              style={[
                styles.faceBoundary,
                {
                  left: face.bounds.origin.x,
                  top: face.bounds.origin.y,
                  width: face.bounds.size.width,
                  height: face.bounds.size.height,
                },
              ]}
            />
          ))}
        </Camera>
      </View>
      <View style={styles.instructionContainer}>
        <Text style={styles.instruction}>
          {faceDetected
            ? "Face detected! Hold still."
            : "Please center your face on the screen."}
        </Text>
        {isScanning && (
          <BarIndicator color={colors.primary} count={5} size={30} />
        )}
      </View>
      <Toast />
    </View>
  );
};

const LoadingText = ({ text }) => (
  <View style={styles.permissionContainer}>
    <Text style={styles.permissionText}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  cameraContainer: {
    width: "95%",
    height: "65%",
    borderRadius: 20,
    overflow: "hidden",
    borderColor: colors.primary,
    borderWidth: 2,
    position: "absolute",
    top: 0,
  },
  camera: {
    width: "100%",
    height: "100%",
  },
  faceBoundary: {
    position: "absolute",
    borderColor: "green",
    borderWidth: 2,
    borderRadius: 5,
  },
  instructionContainer: {
    position: "absolute",
    top: "75%",
    alignItems: "center",
    justifyContent: "center",
  },
  instruction: {
    fontSize: 18,
    color: colors.darkGray,
    marginBottom: 20,
    textAlign: "center",
    paddingHorizontal: 10,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  permissionText: {
    color: colors.darkGray,
  },
});

export default FaceScanner;
