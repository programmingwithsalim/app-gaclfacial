import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "../screens/LoginScreen";
import FaceDetectionScreen from "../screens/FaceDetectionScreen";
import VerificationScreen from "../screens/VerificationScreen";
import ClockOutScreen from "../screens/ClockOutScreen";
import UserCaptureScreen from "../screens/UserCaptureScreen";

import FaceWelcomeScreen from "../screens/FaceWelcomeScreen";
import FingerprintWelcomeScreen from "../screens/FingerprintWelcomeScreen ";

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="LoginScreen"
        screenOptions={({ route }) => ({
          headerShown: false,
          headerStyle: {
            elevation: 0,
          },
        })}
      >
        <Stack.Screen
          name="LoginScreen"
          component={LoginScreen}
          options={{ title: "Login" }}
        />
        <Stack.Screen
          name="FaceWelcomeScreen"
          component={FaceWelcomeScreen}
          options={{ title: "Face Welcome" }}
        />
        <Stack.Screen
          name="FingerprintWelcomeScreen"
          component={FingerprintWelcomeScreen}
          options={{ title: "Fingerprint Welcome" }}
        />
        <Stack.Screen
          name="UserCaptureScreen"
          component={UserCaptureScreen}
          options={{ title: "Capture Screen" }}
        />
        <Stack.Screen
          name="FaceDetectionScreen"
          component={FaceDetectionScreen}
          options={{ title: "Face Detection" }}
        />
        <Stack.Screen
          name="VerificationScreen"
          component={VerificationScreen}
          options={{ title: "Identity Verified" }}
        />
        <Stack.Screen
          name="ClockOutScreen"
          component={ClockOutScreen}
          options={{ title: "Clock Out" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
