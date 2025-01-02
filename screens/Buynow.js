import React, { useState } from 'react';
import { View, Image, StyleSheet, Text, TouchableOpacity, TextInput, Dimensions, ImageBackground, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

const { width } = Dimensions.get('window');

const BuyNowScreen = ({ route, navigation }) => {
  const { product } = route.params;

  // State for form inputs
  const [email, setEmail] = useState('');
  const [productId, setProductId] = useState(product.id); // Assuming the product has an ID
  const [color, setColor] = useState('');
  const [message, setMessage] = useState('');
  const [productName, setProductName] = useState(product.name);
  const [price, setPrice] = useState(product.price);





  const handlePurchase = async () => {
    console.log('Handle button Clicked');
    if (!email || !color || !productId || !productName) {
      setMessage('All fields are required');
      return;
    }
  
    console.log('Sending data to API:', {
      email: email,
      color: color,
      product_id: parseInt(productId),
      product_name: productName,
    });
  
    try {
      const response = await axios.post(
        'http://jerseyshop.iceiy.com/create_order.php',
        {
          email: email,
          color: color,
          product_id: parseInt(productId),
          product_name: productName,
          price: price,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Cookie': '__test=bfbecd9d45acbaeacf538c36e183a097',
            'Host': 'jerseyshop.iceiy.com',
            'User-Agent': 'Mozilla/5.0 (Linux; Android 8.0.0; SM-G955U Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36',
          },
        }
      );
      console.log('Response from API:', response);
      if (response.data.success) {
        setMessage('Order created successfully!');
        Alert.alert('Success', 'Order created successfully!');
      } else {
        setMessage('Error: ' + response.data.message);
      }
    } catch (error) {
      console.error('Error creating order:', error);
      setMessage('Error creating order: ' + (error.response ? error.response.data.message : error.message));
    }
  };

  

  return (
    <ImageBackground source={require('../images/backgroundall.png')} style={styles.container} resizeMode="cover">
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
        accessibilityLabel="Go back"
      >
        <Ionicons name="chevron-back" size={24} color="#fff" />
      </TouchableOpacity>

      <View style={styles.imageContainer}>
      <Image
  source={product.image ? { uri: product.image } : null} // Only show image if product.image is available
  style={styles.productImage}
/>
      </View>

      <Text style={styles.productTitle}>{product.name}</Text>
      <Text style={styles.productPrice}>P{product.price}</Text>

      <View style={styles.productDescriptionContainer}>
        <Text style={styles.productDescription}>{product.description}</Text>
      </View>

      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Color"
          value={color}
          onChangeText={setColor}
        />
        <TouchableOpacity style={[styles.button, styles.buyNowButton]} onPress={handlePurchase}>
          <Text style={styles.buttonText}>Proceed to Checkout</Text>
        </TouchableOpacity>
      </View>

      {message ? <Text style={styles.message}>{message}</Text> : null}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10,
  },
  imageContainer: {
    width: width * 0.5,
    height: width * 0.5,
    borderRadius: 10,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 150,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 10,
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  productTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 20,
  },
  productPrice: {
    fontSize: 20,
    color: '#ff6347',
    fontWeight: 'bold',
    marginTop: 10,
  },
  productDescriptionContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
    width: '90%',
  },
  productDescription: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    lineHeight: 22,
  },
  formContainer: {
    marginTop: 30,
    width: '90%',
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 8,
    borderRadius: 8,
  },
  button: {
    padding: 15,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 5,
  },
  buyNowButton: {
    backgroundColor: '#ff6347',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  message: {
    marginTop: 20,
    fontSize: 16,
    color: 'green',
    textAlign: 'center',
  },
});

export default BuyNowScreen;
