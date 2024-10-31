// App.js
import React from "react";
import AppNavigator from "./navigation/AppNavigator";
import { StatusBar, StyleSheet, View } from "react-native";
import Toast from "react-native-toast-message";
import NetworkStatus from "./components/NetworkStatus";

export default function App() {
  return (
    <NetworkStatus>
      <View style={styles.container}>
        <StatusBar backgroundColor="white" barStyle="dark-content" />
        <AppNavigator />
        <Toast />
      </View>
    </NetworkStatus>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
