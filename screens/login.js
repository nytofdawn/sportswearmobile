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

import background from '../images/backgroundall.png';
import loginb from '../images/login.png';
import logo from '../images/logo.png';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  


  const handleLogin = async () => {
    try {
      // Send POST request
      const response = await axios.post(
        'http://jerseyshop.iceiy.com/login.php',
        {
          email: email,
          password: password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Cookie': '__test=825aa7e027e495727ec5d3e75428b531', // Keep the cookie in the header
            'Host': 'jerseyshop.iceiy.com',
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
          },
          withCredentials: true,  // Ensure cookies are included in requests
        }
      );
  
      console.log('res', response);
  
      if (response.status === 200 && response.data.success) {
        const userId = response.data.user.id;
        const userEmail = response.data.user.email;
        const cookie = response.headers['cookie']; // Extract the cookie from response headers
  
        if (cookie) {
          // Save the cookie to AsyncStorage
          await AsyncStorage.setItem('userCookie', JSON.stringify(cookie));
          console.log('User Cookie saved:', JSON.stringify(cookie)); // Log the saved cookie
        }
  
        // Save user data in AsyncStorage
        await AsyncStorage.setItem('userEmail', userEmail);
        await AsyncStorage.setItem('userId', userId.toString());
        
        console.log('User Email saved:', userEmail); // Log the saved user email
        console.log('User ID saved:', userId); // Log the saved user ID
  
        Alert.alert('Login Successful', 'Welcome back!', [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Dashboard'), // Adjust navigation target
          },
        ]);
      } else {
        Alert.alert('Login Failed', response.data.message || 'Invalid credentials');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'An error occurred while logging in. Please try again.');
    }
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
      </ImageBackground>
    </ImageBackground>
  );
}

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
});
