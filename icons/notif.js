import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Alert, TouchableOpacity, ImageBackground } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons'; // Import vector icons

import backg from '../images/backgroundall.png';

const NotificationScreen = ({ navigation }) => {
  const [customDesigns, setCustomDesigns] = useState([]);
  const [filteredDesigns, setFilteredDesigns] = useState([]);
  const [userId, setUserId] = useState(null);

  // Fetch userId from AsyncStorage
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId'); // Adjust the key as per your AsyncStorage key
        if (storedUserId) {
          setUserId(storedUserId);
        }
      } catch (error) {
        console.error('Error fetching userId from AsyncStorage:', error);
      }
    };

    fetchUserId();
  }, []);

  useEffect(() => {
    const fetchCustomDesigns = async () => {
      try {
        const response = await fetch('http://jerseyshop.iceiy.com/yung_design.php', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Cookie': '__test=825aa7e027e495727ec5d3e75428b531',
            'Host': 'jerseyshop.iceiy.com',
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (Array.isArray(data)) {
          setCustomDesigns(data);
        } else {
          console.log('No custom designs found');
        }
      } catch (error) {
        console.error('Error fetching custom designs:', error);
      }
    };

    fetchCustomDesigns();
  }, []);

  // Filter designs based on userId and show alerts
  useEffect(() => {
    if (userId && customDesigns.length > 0) {
      const userDesigns = customDesigns.filter((design) => design.user_id === userId);

      if (userDesigns.length === 0) {
        Alert.alert(
          "Notice",
          "It looks like you don't have pending works. Create and suggest your logo in customization."
        );
        setFilteredDesigns([]);
        return;
      }

      const approvedDesigns = userDesigns.filter((design) => design.approval === "1");
      const notApprovedDesigns = userDesigns.filter((design) => design.approval !== "1");

      setFilteredDesigns(approvedDesigns);

      // Show alerts for approved designs
      approvedDesigns.forEach((design) => {
        Alert.alert(
          "SUCCESS!",
          `Your Customized Product Jersey Number [${design.jerseyNumber}] is Successfully Approved`,
          [{ text: "OK" }]
        );
      });

      // Show alerts for not approved designs
      notApprovedDesigns.forEach((design) => {
        Alert.alert(
          "OOPS",
          `It looks like you have registered Jersey Number [${design.jerseyNumber}]. Unfortunately, It's not Approved Yet.`,
          [{ text: "OK" }]
        );
      });
    } else if (userId) {
      Alert.alert(
        "Notice",
        "It looks like you don't have pending works. Create and suggest your logo in customization."
      );
    }
  }, [userId, customDesigns]);

  const renderCustomDesign = ({ item }) => {
    return (
      <View style={styles.customDesignItem}>
        <View style={styles.logoContainer}>
          {/* Replace logo image with shirt icon */}
          <Icon name="shirt" size={50} color="#000" style={styles.shirtIcon} />
        </View>
        <Text style={styles.approvalText}>Jersey Number: {item.jerseyNumber}</Text>
      </View>
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

        <Text style={styles.title}>Approved Custom Designs</Text>
        {filteredDesigns.length > 0 ? (
          <FlatList
            data={filteredDesigns}
            renderItem={renderCustomDesign}
            keyExtractor={(item) => item.id.toString()}
          />
        ) : (
          <Text style={styles.noDesignsText}>
            It looks like you don't have pending works. Create and suggest your logo in customization.
          </Text>
        )}
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
  customDesignItem: {
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
  shirtIcon: {
    backgroundColor: '#e6e6e6',
    padding: 10,
    borderRadius: 5,
  },
  approvalText: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
  noDesignsText: {
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
    marginVertical: 20,
  },
});

export default NotificationScreen;
