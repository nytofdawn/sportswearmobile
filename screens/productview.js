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
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import background from '../images/backgroundall.png';

const { width } = Dimensions.get('window');

const ProductViewScreen = ({ route, navigation }) => {
  const { product } = route.params;

  const handleBuyNow = () => {
    navigation.navigate('Buy', { product });
  };

  const handleCustomizePress = () => {
    navigation.navigate('Blank', { product });
  };
  
  const handleAddToCart = async () => {
    try {
      // Step 1: Retrieve the user_id from AsyncStorage
      const userId = await AsyncStorage.getItem('userId'); // Ensure 'userId' is stored during login
      
      if (!userId) {
        alert('Please log in to add items to your cart.');
        return;
      }
  
      // Step 2: Prepare the data to send
      const { name, price, id } = product; // Use the product object from your props or state
      const data = {
        product_name: name, // Match parameter names exactly as expected by PHP
        id, // This corresponds to the 'product_id' in the PHP code
        price,
        user_id: userId,
      };
  
      // Step 3: Send data to the PHP API
      const response = await fetch('http://jerseyshop.iceiy.com/dagdag.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Cookie': '__test=bfbecd9d45acbaeacf538c36e183a097',
          'Host': 'jerseyshop.iceiy.com',
          'User-Agent':
            'Mozilla/5.0 (Linux; Android 8.0.0; SM-G955U Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36',
        },
        body: new URLSearchParams(data).toString(), // Encode data as URL parameters
      });
  
      // Step 4: Handle the response
      const responseData = await response.json();
      if (responseData.status === 'success') {
        alert('Product added to cart!');
      } else {
        alert('Failed to add product to cart: ' + responseData.message);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('An error occurred while adding the product to your cart.');
    }
  };
  

  return (
    <ImageBackground source={background} style={styles.container} resizeMode="cover">
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
        accessibilityLabel="Go back"
      >
        <Ionicons name="chevron-back" size={55} color="#000" />
      </TouchableOpacity>

      <View style={styles.imageContainer}>
      <Image
  source={product.image ? { uri: product.image } : null} // Show image from URL if available, otherwise null
  style={styles.productImage}
/>
      </View>

      {/* Dynamic Product Name */}
      <Text style={styles.productName}>{product.name}</Text>

      {/* Dynamic Product Description */}
      <Text style={styles.itemContainer}>
        {product.description || 'No description available.'}
      </Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.buyNowButton]}
          onPress={handleBuyNow}
        >
          <Text style={styles.buttonText}>Buy Now</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.customizeButton]}
          onPress={handleCustomizePress}
        >
          <Text style={styles.buttonText}>Customize</Text>
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
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10,
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
    color: 'black ',
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
  buyNowButton: {
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
