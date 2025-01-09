import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Alert, Image, ImageBackground, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons'; // Import the icon library
import backgroundimage from '../images/sports.jpeg'; // Import the background image

const ProfileScreen = ({ navigation }) => {
  const [userEmail, setUserEmail] = useState('');
  const [userId, setUserId] = useState('');

  // Fetch the email and userId from AsyncStorage when the component mounts
  useEffect(() => {
    const getUserData = async () => {
      try {
        const email = await AsyncStorage.getItem('userEmail');
        const id = await AsyncStorage.getItem('userId');

        if (email && id) {
          setUserEmail(email);
          setUserId(id);
        }
      } catch (error) {
        console.error('Error getting user data from AsyncStorage:', error);
      }
    };

    getUserData();
  }, []);

  const handleLogout = async () => {
    Alert.alert(
      "Confirm Logout",
      "Are you sure you want to log out?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Logout canceled"),
          style: "cancel",
        },
        {
          text: "Log Out",
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              console.log('User logged out');
              navigation.navigate('Login');
            } catch (error) {
              console.error('Error logging out:', error);
            }
          },
        },
      ]
    );
  };

  return (
    <ImageBackground
      source={backgroundimage} // Use the imported background image
      style={styles.background}
    >
      <View style={styles.container}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backIconContainer}>
             <View style={styles.circle}>
                <Icon name="chevron-back" size={30} color="#fff" />
              </View>
            </TouchableOpacity>

        <View style={styles.card}>
          <Text style={styles.title}>Profile Information</Text>
          <Image
            source={require('../images/icon.png')} // Update the path to your icon.png image
            style={styles.icon}
          />
          {userEmail && userId ? (
            <>
              <Text style={styles.text}>Email: {userEmail}</Text>
              <Text style={styles.text}>User ID: {userId}</Text>
            </>
          ) : (
            <Text style={styles.text}>No user data found</Text>
          )}
          <View style={styles.buttonContainer}>
            <Button title="Log Out" color="#ff6b6b" onPress={handleLogout} />
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  backIconContainer: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10,
  },
  circle: {
    width: 40, // Smaller size for the circle
    height: 40, // Smaller size for the circle
    borderRadius: 20, // Make it circular
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // Semi-transparent black
    justifyContent: 'center', // Center the icon
    alignItems: 'center', // Center the icon
  },
  card: {
    backgroundColor: '#fff', // White background for the card
    borderRadius: 16,
    padding: 20,
    width: '90%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5, // Shadow for Android
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333', // Darker color for better contrast
  },
  icon: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    marginVertical: 5,
    color: '#555', // Slightly gray for readability
  },
  buttonContainer: {
    marginTop: 20,
    width: '100%',
    borderRadius: 8,
    overflow: 'hidden',
  },
});

export default ProfileScreen;
