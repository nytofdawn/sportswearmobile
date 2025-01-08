import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, TouchableOpacity, ImageBackground, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import background from '../images/backgroundall.png';

const CartScreen = ({ navigation }) => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        // Get userId from AsyncStorage
        const storedUserId = await AsyncStorage.getItem('userId');
        if (!storedUserId) {
          Alert.alert('Error', 'User not logged in.');
          return;
        }

        // Fetch cart data from the new API
        const response = await axios.get(`https://jerseystore-server.onrender.com/web/getCartItems?userID=${storedUserId}`);


        if (response.data.status === 'success') {
          setCartItems(response.data.data);  // Update cart items with fetched data
        } else {
          Alert.alert('Error', response.data.message);
        }
      } catch (error) {
        console.error('Error fetching cart items:', error);
        Alert.alert('Error', 'An error occurred while fetching cart items.');
      }
    };

    fetchCart(); // Initial fetch of cart items
    const intervalId = setInterval(fetchCart, 1000); // Set an interval to refetch cart every 3 seconds

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const handleCreateOrder = async (product) => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        alert('Please log in to create an order.');
        return;
      }

      // Ensure the 'product' has all necessary fields
      const { name, price, _id, description, image, size = 'M', category = 'General', quantity = 1 } = product;

      if (!name || !price || !category || !quantity) {
        alert('Missing required fields: name, price, category, and quantity.');
        return;
      }

      const data = {
        userId,
        name: name,
        size,
        category,
        price,
        quantity,
        totalAmount: price * quantity,
        status: 'pending',
      };


      const response = await fetch('https://jerseystore-server.onrender.com/web/CreateOrders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      console.log('Response status:', response.status); // Log HTTP status
      console.log('Response data:', responseData); // Log the entire response

      if (response.ok && responseData._id) {
        alert('Order successfully created!');
        // Remove the item from the cart after a successful purchase
        handleDeleteItem(product._id || product.productID?._id);
      } else {
        const errorMessage = responseData.message || `Unexpected error: ${response.status}`;
        alert('Failed to create order: ' + errorMessage);
      }
    } catch (error) {
      console.error('Error creating order:', error);
      alert('An error occurred while creating the order.');
    }
  };

  // Handle deleting item from cart with real-time UI update
  const handleDeleteItem = async (itemId) => {
    try {
      const storedUserId = await AsyncStorage.getItem('userId');
      if (!storedUserId) {
        Alert.alert('Error', 'User not logged in.');
        return;
      }

      const response = await axios.delete('https://jerseystore-server.onrender.com/web/deleteFromCart', {
        data: { userID: storedUserId, productID: itemId },
      });

      if (response.data.status === 'success') {
        // Immediately update the cart items state to remove the deleted item
        setCartItems(prevCartItems => prevCartItems.filter(item => item._id !== itemId));
        Alert.alert('Success', 'Item successfully deleted.');
      } else {
        Alert.alert('Error', response.data.message || 'Failed to delete item.');
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      Alert.alert('Error', 'An error occurred while deleting the item.');
    }
  };

  return (
    <ImageBackground source={background} style={styles.container} resizeMode="cover">
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backIconContainer}>
        <Icon name="chevron-back" size={30} color="#000" />
      </TouchableOpacity>

      {cartItems.length === 0 ? (
        <Text style={styles.emptyText}>Your cart is empty.</Text>
      ) : (
        <FlatList
          data={cartItems}
          keyExtractor={(item) => item._id || (item.productID && item.productID._id) || 'default-key'}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              {item.productID && item.productID.image ? (
                <Image
                  source={{ uri: item.productID.image }}
                  style={styles.productImage}
                  resizeMode="contain"
                />
              ) : (
                <View style={styles.productImage} />
              )}
              <View style={styles.textContainer}>
                <Text style={styles.itemText}>
                  Product: {item.productID ? item.productID.product_name : 'Unknown Product'}
                </Text>
                <Text style={styles.itemText}>
                  Price: PHP {item.productID && item.productID.price ? parseFloat(item.productID.price).toFixed(2) : '0.00'}
                </Text>
              </View>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.buyNowButton}
                  onPress={() => handleCreateOrder(item.productID)}
                >
                  <Text style={styles.buttonText}>Buy Now</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeleteItem(item.productID ? item.productID._id : item._id)}
                >
                  <Text style={styles.buttonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  emptyText: {
    fontSize: 18,
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
  },
  itemContainer: {
    backgroundColor: '#fff',
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 16,
    backgroundColor: '#f0f0f0',
  },
  textContainer: {
    flex: 1,
  },
  itemText: {
    fontSize: 16,
    color: '#333',
  },
  backIconContainer: {
    position: 'absolute',
    top: 20,
    left: 10,
    zIndex: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buyNowButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginRight: 8,
    borderRadius: 8,
  },
  deleteButton: {
    backgroundColor: '#f44336',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
  },
});

export default CartScreen;
