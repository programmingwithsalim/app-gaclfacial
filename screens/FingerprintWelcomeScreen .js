import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Button } from 'react-native-paper';

const FingerprintWelcomeScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fingerprint detection</Text>
      <Text style={styles.subtitle}>Scan your fingerprint to verify your identity.</Text>

      <View style={styles.fingerprintContainer}>
        <Image
          source={require('../assets/fingerprint.jpg')}
          style={styles.fingerprintIcon}
        />
      </View>

      <View style={styles.checks}>
        <Text style={styles.checkItem}>🟢 Clean Finger</Text>
        <Text style={styles.checkItem}>🔆 Low lighting</Text>
      </View>

      <Button mode="contained" onPress={() => console.log('Start scan')} style={styles.button}>
        Start scan
      </Button>
      
      <Text style={styles.footer}>The flash will be activated</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#777',
    marginBottom: 20,
  },
  fingerprintContainer: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  fingerprintIcon: {
    width: 100,
    height: 100,
  },
  checks: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: 20,
  },
  checkItem: {
    fontSize: 14,
    color: '#333',
  },
  button: {
    width: '80%',
    backgroundColor: '#00c853',
  },
  footer: {
    marginTop: 10,
    fontSize: 12,
    color: '#777',
  },
});

export default FingerprintWelcomeScreen;
