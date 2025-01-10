import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ImageBackground, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import background from '../images/backgroundall.png';
import api_url from '../api';

const FetchOrderScreen = ({ navigation }) => {
  const [orders, setOrders] = useState([]);
  const [userEmail, setUserEmail] = useState(''); // Store the current user's email

  // Fetch the userEmail from AsyncStorage when the component mounts
  useEffect(() => {
    const getUserEmail = async () => {
      try {
        const email = await AsyncStorage.getItem('userEmail'); // Retrieve the userEmail of the logged-in user
        if (email) {
          setUserEmail(email); // Update the state with the user's email
        } else {
          console.log('No userEmail found in AsyncStorage');
        }
      } catch (error) {
        console.error('Error getting userEmail from AsyncStorage:', error);
      }
    };

    getUserEmail(); // Fetch user's email when the component mounts
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${api_url}/web/getOrder`, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        console.log('Response Data:', response.data);
  
        if (Array.isArray(response.data.data)) {
          // Filter the orders based on userEmail matching the email in the response
          const filteredOrders = response.data.data.filter(order => order.email === userEmail);
          setOrders(filteredOrders); // Set filtered orders
  
          // Check for completed orders and show alerts
          filteredOrders.forEach(order => {
            if (order.status === 'completed') {
              const productName = order.name || 'Unknown Product'; // Get product name
              if (order.deliveryOption === 'Door-to-Door') {
                Alert.alert('Order Update', `You have an order on the way: ${productName}`);
              } else if (order.deliveryOption === 'Pickup') {
                Alert.alert('Order Update', `Your order is ready for pickup: ${productName}`);
              }
            }
          });
        } else {
          console.log('Response data is not an array:', response.data);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };
  
    if (userEmail) {
      fetchOrders(); // Fetch orders when userEmail is available
    }
  }, [userEmail]); // Re-run when userEmail changes
  

  // Render each order item
  const renderOrderItem = ({ item }) => (
    <View style={styles.orderItem}>
      <Text style={styles.productName}>Product Name: {item.name || 'N/A'}</Text>
      <Text style={styles.orderAt}>Order At: {item.createdAt || 'Unknown'}</Text>
      <Text style={styles.orderText}>Category: {item.category || 'N/A'}</Text>
      <Text style={styles.orderText}>Status: {item.status || 'N/A'}</Text>
      <Text style={styles.orderText}>Delivery Option: {item.deliveryOption || 'N/A'}</Text>
      <Text>Email: {item.email}</Text>
    </View>
  );

  return (
    <ImageBackground source={background} style={styles.container} resizeMode="cover">
      <Text style={styles.title}>My Orders</Text>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backIconContainer}>
        <View style={styles.circle}>
          <Icon name="chevron-back" size={50} color="#fff" />
        </View>
      </TouchableOpacity>
      {orders.length === 0 ? (
        <Text style={styles.noOrdersText}>No orders found.</Text>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item._id.toString()} // Ensure proper key extraction from MongoDB ObjectId
          renderItem={renderOrderItem}
        />
      )}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 35,
    backgroundColor: '#fff',
  },
  title: {
    marginTop: 45,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  orderItem: {
    padding: 12,
    marginBottom: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  orderAt: {
    fontSize: 14,
    color: '#555',
  },
  orderText: {
    fontSize: 14,
    color: '#555',
  },
  noOrdersText: {
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
    marginVertical: 20,
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

export default FetchOrderScreen;
