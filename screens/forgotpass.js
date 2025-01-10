import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ImageBackground } from 'react-native';
import axios from 'axios';
import api_url from '../api';
import Icon from 'react-native-vector-icons/Ionicons';

const backgroundimg = require('../images/backgroundall.png')

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [stage, setStage] = useState(1); // 1: Email, 2: OTP, 3: Reset Password

  const handleSendOTP = async () => {
    try {
      const response = await axios.post(
        `${api_url}/web/forgotPassword`,
        { email },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200 && response.data.success) {
        setStage(2); // Move to OTP stage
        Alert.alert('OTP Sent', 'A one-time password has been sent to your email.');
      } else {
        Alert.alert('Error', 'Unable to send OTP. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while sending the OTP. Please try again.');
    }
  };

  const handleVerifyOTP = async () => {
    try {
      const response = await axios.post(
        `${api_url}/web/verifyOTP`,
        { email, otp },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200 && response.data.success) {
        setStage(3); // Move to Reset Password stage
        Alert.alert('OTP Verified', 'OTP is correct. Please enter a new password.');
      } else {
        Alert.alert('Error', 'Invalid OTP. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while verifying the OTP. Please try again.');
    }
  };

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match. Please try again.');
      return;
    }

    try {
      const response = await axios.post(
        `${api_url}/web/resetPassword`,
        { email, newPassword },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200 && response.data.success) {
        Alert.alert('Success', 'Your password has been reset successfully.', [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Login'),
          },
        ]);
      } else {
        Alert.alert('Error', 'Something went wrong. Please try again later.');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while resetting the password. Please try again.');
    }
  };

  return (
    <ImageBackground source={require('../images/backgroundall.png')} style={styles.container}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backIconContainer}>
                <View style={styles.circle}>
                  <Icon name="chevron-back" size={50} color="#fff" />
                </View>
              </TouchableOpacity>
      {stage === 1 && (
        <>
          <Text style={styles.title}>Forgot Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
          />
          <TouchableOpacity style={styles.button} onPress={handleSendOTP}>
            <Text style={styles.buttonText}>Send OTP</Text>
          </TouchableOpacity>
        </>
      )}

      {stage === 2 && (
        <>
          <Text style={styles.title}>Verify OTP</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter OTP"
            keyboardType="numeric"
            value={otp}
            onChangeText={setOtp}
          />
          <TouchableOpacity style={styles.button} onPress={handleVerifyOTP}>
            <Text style={styles.buttonText}>Verify OTP</Text>
          </TouchableOpacity>
        </>
      )}

      {stage === 3 && (
        <>
          <Text style={styles.title}>Reset Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter New Password"
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
          />
          <TextInput
            style={styles.input}
            placeholder="Confirm New Password"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
            <Text style={styles.buttonText}>Reset Password</Text>
          </TouchableOpacity>
        </>
      )}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: '80%',
    padding: 10,
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    width: '80%',
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  backIconContainer: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10,
  },
  circle: {
    width: 60, // Size of the circle
    height: 60, // Size of the circle
    borderRadius: 30, // Make it circular
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // Background color of the circle
    justifyContent: 'center', // Center the icon
    alignItems: 'center', // Center the icon
  },
});

export default ForgotPasswordScreen;
