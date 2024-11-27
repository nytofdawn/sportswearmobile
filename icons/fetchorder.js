import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage'; // For accessing user's email from AsyncStorage

const FetchOrderScreen = () => {
  const [orders, setOrders] = useState([]);
  const [userEmail, setUserEmail] = useState(''); // Store the current user's email

  useEffect(() => {
    const getUserEmail = async () => {
      try {
        const email = await AsyncStorage.getItem('userEmail'); // Retrieve the email of the logged-in user
        if (email) {
          setUserEmail(email); // Update the state with the user's email
        } else {
          console.log('No email found in AsyncStorage');
        }
      } catch (error) {
        console.error('Error getting user email from AsyncStorage:', error);
      }
    };

    getUserEmail(); // Fetch user's email when the component mounts
  }, []);

  useEffect(() => {
    if (!userEmail) {
      return; // If email is not yet fetched, don't proceed
    }

    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://jerseyshop.iceiy.com/yung_order.php', {
          headers: {
            'Content-Type': 'application/json',
            'Cookie': '__test=825aa7e027e495727ec5d3e75428b531',
            'Host': 'jerseyshop.iceiy.com',
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
          },
          params: {
            email: userEmail, // Pass user's email as a query parameter
          },
        });
        const filteredOrders = response.data.filter((order) => order.email === userEmail);
        setOrders(filteredOrders); // Update state with filtered orders
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, [userEmail]);

  const renderOrderItem = ({ item }) => (
    <View style={styles.orderItem}>
      <Text style={styles.productName}>Product Name: {item.product_name || 'N/A'}</Text>
      <Text style={styles.orderAt}>Order At: {item.created_at || 'Unknown'}</Text>
      <Text style={styles.orderText}>Color: {item.color || 'N/A'}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Orders</Text>
      {orders.length === 0 ? (
        <Text style={styles.noOrdersText}>No orders found.</Text>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderOrderItem}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
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
  noOrdersText: {
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
    marginVertical: 20,
  },
});

export default FetchOrderScreen;