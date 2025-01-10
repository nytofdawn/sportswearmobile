import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Image,
  Alert,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api_url from '../api';

import background from '../images/backgroundall.png';
import loginb from '../images/login.png';
import logo from '../images/logo.png';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        `${api_url}/web/loginUser`,
        { email, password },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('Login Response:', response.data);

      if (response.status === 200 && response.data.isLoggedIn) {
        const { id: userId, email: userEmail } = response.data.user;
        const token = response.data.token;

        await AsyncStorage.setItem('userEmail', userEmail);
        await AsyncStorage.setItem('userId', userId.toString());
        await AsyncStorage.setItem('userToken', token);

        Alert.alert('Login Successful', 'Welcome back!', [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Dashboard'),
          },
        ]);
      } else {
        Alert.alert(
          'Login Failed',
          response.data.message || 'Incorrect email or password. Please try again.'
        );
      }
    } catch (error) {
      if (error.response?.data?.message) {
        Alert.alert('Login Failed', error.response.data.message);
      } else {
        console.error('Unexpected Error:', error.response?.data || error.message);
        Alert.alert('Error', 'An error occurred while logging in. Please try again.');
      }
    }
  };

  const handleForgotPassword = () => {
    // Navigate to the Forgot Password screen
    navigation.navigate('forgotpass');
  };

  return (
    <ImageBackground source={background} style={styles.container} resizeMode="cover">
      <View style={styles.logoContainer}>
        <Image source={logo} style={styles.logo} />
      </View>

      <ImageBackground source={loginb} style={styles.logcontainer} resizeMode="cover">
        <Text style={styles.title}>Login</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#fff"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#fff"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        {/* Forgot Password Button */}
        <TouchableOpacity onPress={handleForgotPassword}>
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>
      </ImageBackground>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 40,
    alignItems: 'center',
  },
  logo: {
    marginTop: 50,
    width: 350,
    height: 150,
    resizeMode: 'contain',
  },
  title: {
    textAlign: 'center',
    marginTop: 80,
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff',
  },
  input: {
    width: '80%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    marginLeft: '10%',
    marginTop: 20,
    marginBottom: 10,
    borderRadius: 30,
    paddingHorizontal: 10,
    color: '#fff',
  },
  logcontainer: {
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    flex: 1,
    marginTop: 80,
    width: '100%',
    overflow: 'hidden',
    alignItems: 'center',
  },
  button: {
    width: '50%',
    backgroundColor: 'red',
    paddingVertical: 10,
    borderRadius: 50,
    marginTop: 40,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  forgotPasswordText: {
    color: '#007bff',
    fontSize: 14,
    marginTop: 20,
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;
