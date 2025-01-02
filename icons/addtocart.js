import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Alert, TouchableOpacity, ImageBackground } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import background from '../images/backgroundall.png';

const CartScreen = ({ navigation }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        setLoading(true);
  
        // Get userId from AsyncStorage
        const storedUserId = await AsyncStorage.getItem('userId');
        if (!storedUserId) {
          Alert.alert('Error', 'User not logged in.');
          setLoading(false);
          return;
        }
  
        // Fetch cart data from the API
        const response = await fetch('http://jerseyshop.iceiy.com/karton.php', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Cookie': '__test=bfbecd9d45acbaeacf538c36e183a097',
            'Host': 'jerseyshop.iceiy.com',
            'User-Agent': 'Mozilla/5.0 (Linux; Android 8.0.0; SM-G955U Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36',
          },
        });
        const responseData = await response.json();
        console.log('Fetched data:', responseData);
  
        if (responseData.status === 'success') {
          const filteredCart = responseData.data.filter(
            (item) => item.user_id === storedUserId
          );
  
          setCartItems(filteredCart);
        } else {
          Alert.alert('Error', responseData.message);
        }
      } catch (error) {
        console.error('Error fetching cart items:', error);
        Alert.alert('Error', 'An error occurred while fetching cart items.');
      } finally {
        setLoading(false);
      }
    };
  
    fetchCart();
  }, []);
  

  const handleBuyNow = async (item, selectedColor) => {
    console.log('Buy Now clicked for item:', item, 'Selected Color:', selectedColor);

    try {
      // Retrieve the user's email from AsyncStorage
      const userEmail = await AsyncStorage.getItem('userEmail');
      
      if (!userEmail) {
        Alert.alert('Error', 'You must be logged in to place an order.');
        return;
      }

      // Use default color if none is selected
      const colorToUse = selectedColor || 'default';  // Default color is 'default' if not selected

      // Send order creation request to the API
      const response = await axios.post('http://jerseyshop.iceiy.com/create_order.php', {
        email: userEmail,  // Send the logged-in user's email
        product_id: item.product_id,
        product_name: item.product_name,
        price: item.price,
        color: colorToUse,  // Use the selected color or default color
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Cookie': '__test=bfbecd9d45acbaeacf538c36e183a097',
          'Host': 'jerseyshop.iceiy.com',
          'User-Agent': 'Mozilla/5.0 (Linux; Android 8.0.0; SM-G955U Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36',
        }
      });

      // Log the API response to help debug the issue
      console.log('API Response:', response.data);

      if (response.data.success) {
        Alert.alert('Success', 'Order created successfully!');
        
        // After order creation, remove the item from the cart locally
        const updatedCart = cartItems.filter(cartItem => cartItem.id !== item.id);
        setCartItems(updatedCart);
      } else {
        Alert.alert('Error', 'Failed to create order.');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      Alert.alert('Error', 'An error occurred while creating the order.');
    }
  };

  const handleDelete = async (productId) => {
    Alert.alert(
      'Confirm Deletion', // Title of the alert
      'Are you sure you want to delete this item?', // Message
      [
        {
          text: 'Cancel',
          style: 'cancel', // This styles the button as a "Cancel" action
        },
        {
          text: 'Delete',
          style: 'destructive', // This styles the button to indicate a destructive action
          onPress: async () => {
            try {
              console.log('Product ID', productId);
  
              // Send the 'id' in the request body
              const response = await axios.post(
                'http://jerseyshop.iceiy.com/tanggal_baga.php',
                { id: productId }, // Send 'id' instead of 'product_id'
                {
                  headers: {
                    'Content-Type': 'application/json',
                    'Cookie': '__test=bfbecd9d45acbaeacf538c36e183a097',
                    'Host': 'jerseyshop.iceiy.com',
                    'User-Agent': 'Mozilla/5.0 (Linux; Android 8.0.0; SM-G955U Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36',
                  },
                }
              );
  
              console.log('Delete response:', response.data);
  
              // Check if the item was deleted successfully
              if (response.data.status === 'success') {
                Alert.alert('Success', response.data.message);
                // Remove the deleted item from the local cart list
                const updatedCart = cartItems.filter(cartItem => cartItem.id !== productId);
                setCartItems(updatedCart);
              } else {
                Alert.alert('Error', response.data.message);
              }
            } catch (error) {
              console.error('Error deleting item:', error);
              Alert.alert('Error', 'An error occurred while deleting the item.');
            }
          },
        },
      ]
    );
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
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <Text style={styles.itemText}>Product: {item.product_name}</Text>
              <Text style={styles.itemText}>Price: PHP{parseFloat(item.price).toFixed(2)}</Text>
              
              <TouchableOpacity 
                style={styles.cancelButton} 
                onPress={() => handleDelete(item.id)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.buyNowButton} 
                onPress={() => handleBuyNow(item)}
              >
                <Text style={styles.buttonText}>Buy Now</Text>
              </TouchableOpacity>
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
    position: 'relative',
  },
  itemText: {
    fontSize: 16,
    color: '#333',
  },
  backIconContainer: {
    position: 'absolute',
    top: 20,
    left: 10,
    zIndex: 1,
  },
  cancelButton: {
    backgroundColor: '#f44336',
    padding: 8,
    borderRadius: 8,
    position: 'absolute',
    top: 16,
    right: 16,
    elevation: 2,
  },
  buyNowButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default CartScreen;
