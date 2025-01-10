import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, TouchableOpacity, ImageBackground, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import api_url from '../api';

const paymongoAPIKey = 'sk_test_vcNRX3jputurLKGX1jXravqS';

import background from '../images/backgroundall.png';

const CartScreen = ({ navigation }) => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        if (!storedUserId) {
          Alert.alert('Error', 'User not logged in.');
          return;
        }

        const response = await axios.get(`${api_url}/web/getCartItems?userID=${storedUserId}`);
        
        if (response.data.status === 'success') {
          const groupedCartItems = groupCartItems(response.data.data);
          setCartItems(groupedCartItems);
        } else {
          Alert.alert('Error', response.data.message);
        }
      } catch (error) {
        console.error('Error fetching cart items:', error);
        Alert.alert('Error', 'An error occurred while fetching cart items.');
      }
    };

    fetchCart();
    const intervalId = setInterval(fetchCart, 1000);

    return () => clearInterval(intervalId);
  }, []);

  // Helper function to group cart items by product ID and accumulate the quantity
  const groupCartItems = (cartItems) => {
    const groupedItems = [];
    const productMap = new Map();

    cartItems.forEach((item) => {
      const productID = item.productID._id;
      const existingItem = productMap.get(productID);
      if (existingItem) {
        existingItem.quantity += 1; // Increment the quantity
      } else {
        const newItem = { ...item, quantity: 1 };
        productMap.set(productID, newItem);
      }
    });

    // Convert Map to array
    productMap.forEach((item) => {
      groupedItems.push(item);
    });

    return groupedItems;
  };

  const createPaymentLink = async () => {
    try {
      const res = await axios.post('https://api.paymongo.com/v1/links', {
        data: {
          attributes: {
            amount: 10000,
            description: 'Thank you for trusting Primo\'s Sportswear',
          }
        }
      }, {
        headers: {
          Authorization: `Basic ${btoa(paymongoAPIKey + ':')}`,
          'Content-Type': 'application/json'
        }
      });
      const paymentInfos = {
        paymentLinkID: res.data.data.id,
        paymentLinkUrl: res.data.data.attributes.checkout_url
      }
      return paymentInfos;
    } catch (err) {
      console.error(err);
    }
  }

  const handleCreateOrder = async (product) => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        alert('Please log in to create an order.');
        return;
      }

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

      createPaymentLink().then(res => {
        navigation.navigate("CartPay", { paymentInfo: res, data: data, product: product });
      });

    } catch (error) {
      console.error('Error creating order:', error);
      alert('An error occurred while creating the order.');
    }
  };

  const handleDeleteItem = async (itemId) => {
    try {
      const storedUserId = await AsyncStorage.getItem('userId');
      if (!storedUserId) {
        Alert.alert('Error', 'User not logged in.');
        return;
      }

      const response = await axios.delete(`${api_url}/web/deleteFromCart`, {
        data: { userID: storedUserId, productID: itemId },
      });

      if (response.data.status === 'success') {
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
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Primo's CART</Text>
      </View>

      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backIconContainer}>
        <View style={styles.circle}>
          <Icon name="chevron-back" size={50} color="#fff" />
        </View>
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
                <Text style={styles.itemText}>
                  Quantity: {item.quantity}
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
  headerContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    marginTop:25,
    paddingVertical: 10,
    paddingHorizontal: 16,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 25,
    color: '#888',
    textAlign: 'center',
    marginTop: 60,
  },
  itemContainer: {
    backgroundColor: '#fff',
    padding: 16,
    marginVertical: 8,
    marginTop: 25,
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
    top: 40,
    left: 20,
    zIndex: 10,
  },
  circle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
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
