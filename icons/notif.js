import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Alert, TouchableOpacity, ImageBackground, Image, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons'; // Import vector icons

import backg from '../images/backgroundall.png';

const NotificationScreen = ({ navigation }) => {
  const [logos, setLogos] = useState([]);
  const [userEmail, setUserEmail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user email from AsyncStorage
  useEffect(() => {
    const fetchUserEmail = async () => {
      try {
        const storedUserEmail = await AsyncStorage.getItem('userEmail'); // Adjust the key as per your AsyncStorage key
        if (storedUserEmail) {
          setUserEmail(storedUserEmail);
        }
      } catch (error) {
        console.error('Error fetching userEmail from AsyncStorage:', error);
      }
    };

    fetchUserEmail();
  }, []);

  // Fetch all logos data
  useEffect(() => {
    const fetchLogos = async () => {
      try {
        const response = await fetch('https://jerseystore-server.onrender.com/web/logos', { // Replace with your API endpoint
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (Array.isArray(data)) {
          // Filter logos by userEmail from AsyncStorage
          const filteredLogos = data.filter((logo) => logo.email === userEmail);
          setLogos(filteredLogos);
        } else {
          console.log('No logos found');
        }
      } catch (error) {
        setError('Error fetching logos data. Please try again later.');
        console.error('Error fetching logos:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userEmail) {
      fetchLogos();
    }
  }, [userEmail]);

  const renderLogo = ({ item }) => {
    return (
      <View style={styles.logoItem}>
        <View style={styles.logoContainer}>
          {item.logoUrl ? (
            <Image source={{ uri: item.logoUrl }} style={styles.logoImage} />
          ) : (
            <Text>No Image</Text>
          )}
        </View>
        <Text style={styles.logoName}>Logo: {item.name}</Text>
        <Text style={styles.approvalText}>Approval: {item.approval ? 'Approved' : 'Not Approved'}</Text>
      </View>
    );
  };

  const renderContent = () => {
    if (loading) {
      return <ActivityIndicator size="large" color="#0000ff" />;
    }

    if (error) {
      return (
        <Text style={styles.errorText}>{error}</Text>
      );
    }

    return (
      <>
        <Text style={styles.title}>Your Logos</Text>
        {logos.length > 0 ? (
          <FlatList
            data={logos}
            renderItem={renderLogo}
            keyExtractor={(item) => item._id.toString()} // Ensure the key is unique for each logo
          />
        ) : (
          <Text style={styles.noLogosText}>No logos available at the moment.</Text>
        )}
      </>
    );
  };

  return (
    <ImageBackground source={backg} style={styles.container}>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()} // Navigate back
        >
          <Icon name="chevron-back-outline" size={30} color="#000" />
        </TouchableOpacity>

        {renderContent()}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'transparent',
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 10,
    backgroundColor: '#fff',
    borderRadius: 50,
    padding: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 50, // Account for the back button
    textAlign: 'center',
  },
  logoItem: {
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#e6f7ff',
    borderRadius: 5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  logoContainer: {
    marginBottom: 10,
  },
  logoImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  logoName: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
  approvalText: {
    fontSize: 14,
    color: '#666',
  },
  noLogosText: {
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
    marginVertical: 20,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginVertical: 20,
  },
});

export default NotificationScreen;
