import React from 'react';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Text,
  ImageBackground,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
const paymongoAPIKey = 'sk_test_vcNRX3jputurLKGX1jXravqS';
import api_url from '../api';

const { width } = Dimensions.get('window');

const ProductViewScreen = ({ route, navigation }) => {
  const { product } = route.params;
  const nav = useNavigation();

  const createPaymentLink = async () => {
    try {
      const res = await axios.post('https://api.paymongo.com/v1/links', {
        data: {
          attributes: {
            amount: 10000, // Update this based on the product price
            description: 'Thank you for trusting Primo\'s Sportswear',
          }
        }
      }, {
        headers: {
          Authorization: `Basic ${btoa(paymongoAPIKey + ':')}`,
          'Content-Type': 'application/json'
        }
      });
      // Payment link creation
      const paymentInfos = {
        paymentLinkID: res.data.data.id,
        paymentLinkUrl: res.data.data.attributes.checkout_url
      };
      return paymentInfos;
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateOrder = async () => {
    const userId = await AsyncStorage.getItem('userId');
    if (!userId) {
      alert('Please log in to proceed.');
      return;
    }
  
    if (!route.params.address || !route.params.deliveryOption) {
      alert('Please enter your address and delivery option first.');
      navigation.navigate('AddressAndDeliveryScreen', { product });
      return;
    }
  
    const { address, deliveryOption } = route.params;
  
    // Define quantity (e.g., hardcoded to 1 for simplicity or allow user selection)
    const quantity = 1;
    const totalAmount = product.price * quantity;
  
    const orderData = {
      ...product,
      address,
      deliveryOption,
      userId,
      quantity, // Ensure quantity is included
      totalAmount, // Include totalAmount
    };
  
    console.log('orderData:', orderData);
  
    // Create payment link
    createPaymentLink().then((res) => {
      navigation.navigate('Payment', { paymentInfo: res, orderData });
    });
  };
  

  const handleCustomizePress = () => {
    navigation.navigate('Blank', { product });
  };

  const handleAddToCart = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        alert('Please log in to add to the cart.');
        return;
      }

      const { _id, name, price, description, image, size = 'M', category = 'General' } = product;

      const data = {
        userID: userId,
        productID: _id,
      };

      console.log('Sending data to AddToCart API:', data);

      const response = await fetch(`${api_url}/web/AddToCart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();
      console.log('Response:', responseData);

      if (response.ok) {
        alert('Product added to cart!');
      } else {
        alert('Failed to add product to cart: ' + responseData.message);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('An error occurred while adding the product to the cart.');
    }
  };

  return (
    <ImageBackground source={require('../images/backgroundall.png')} style={styles.container} resizeMode="cover">
      <TouchableOpacity onPress={() => navigation.navigate('Dashboard')} style={styles.backIconContainer}>
        <View style={styles.circle}>
          <Icon name="chevron-back" size={50} color="#fff" />
        </View>
      </TouchableOpacity>

      <View style={styles.imageContainer}>
        <Image
          source={product.image ? { uri: product.image } : null}
          style={styles.productImage}
        />
      </View>

      <Text style={styles.productName}>{product.name}</Text>

      <Text style={styles.itemContainer}>
        {product.description || 'No description available.'}
      </Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.createOrderButton]}
          onPress={handleCreateOrder}
        >
          <Text style={styles.buttonText}>Buy Now</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.customizeButton]}
          onPress={handleCustomizePress}
        >
          <Text style={styles.buttonText}>Buy with Custom</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.addToCartButton]}
          onPress={handleAddToCart}
        >
          <Text style={styles.buttonText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
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
  imageContainer: {
    width: width * 1,
    height: width * 0.9,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 160, 122, 0.3)',
    borderWidth: 3,
    borderColor: '#000000',
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
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    marginTop: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  createOrderButton: {
    backgroundColor: 'green',
  },
  customizeButton: {
    backgroundColor: '#ffa500',
  },
  addToCartButton: {
    backgroundColor: 'grey',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  itemContainer: {
    color: 'white',
    marginTop: 20,
    padding: 10,
    width: width * 0.9,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#000000',
    overflow: 'hidden',
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    lineHeight: 22,
  },
});

export default ProductViewScreen;
