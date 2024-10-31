// NetworkStatus.js
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import NetInfo from "@react-native-community/netinfo";

const TARGET_BSSID = "02:00:00:00:00:00";

const NetworkStatus = ({ children }) => {
  const [isConnected, setIsConnected] = useState(true);
  const [isTargetWifi, setIsTargetWifi] = useState(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
      if (state.isConnected && state.type === "wifi") {
        const { bssid } = state.details;
        setIsTargetWifi(bssid === TARGET_BSSID);
      } else {
        setIsTargetWifi(false);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleRetry = () => {
    NetInfo.fetch().then((state) => {
      setIsConnected(state.isConnected);
      if (state.isConnected && state.type === "wifi") {
        const { bssid } = state.details;
        setIsTargetWifi(bssid === TARGET_BSSID);
      } else {
        setIsTargetWifi(false);
      }
    });
  };

  return (
    <View style={styles.container}>
      {!isConnected && (
        <View style={styles.banner}>
          <Text style={styles.errorText}>No Internet Connection</Text>
          <TouchableOpacity onPress={handleRetry} style={styles.retryButton}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}
      {isConnected && !isTargetWifi && (
        <View style={styles.banner}>
          <Text style={styles.errorText}>Please connect to the correct network.</Text>
          <TouchableOpacity onPress={handleRetry} style={styles.retryButton}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  banner: {
    backgroundColor: "rgba(255, 0, 0, 0.3)",
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 2,
    borderBottomColor: "#fff",
    // elevation: 5, // Shadow for Android
    // borderRadius: 8, // Rounded corners
  },
  errorText: {
    color: "white",
    fontSize: 18,
    marginBottom: 10, 
  },
  retryButton: {
    backgroundColor: "yellow",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  retryText: {
    color: "black",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default NetworkStatus;
