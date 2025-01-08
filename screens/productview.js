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

const { width } = Dimensions.get('window');

const ProductViewScreen = ({ route, navigation }) => {
  const { product } = route.params;

  const handleCreateOrder = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        alert('Please log in to create an order.');
        return;
      }

      const { name, price, _id, description, image, size = 'M', category = 'General' } = product;
      const data = {
        userId,
        name,
        size,
        category,
        price,
        quantity: 1,
        totalAmount: price,
        status: 'pending',
      };

      console.log('Order payload:', data);

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
      } else {
        const errorMessage = responseData.message || `Unexpected error: ${response.status}`;
        alert('Failed to create order: ' + errorMessage);
      }
    } catch (error) {
      console.error('Error creating order:', error);
      alert('An error occurred while creating the order.');
    }
  };

  const handleCustomizePress = () => {
    navigation.navigate('Blank', { product });
    console.log('PRo',product);
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
        userID: userId, // Update to userID
        productID: _id, // Update to productID
      };
  
      console.log('Sending data to AddToCart API:', data);
  
      const response = await fetch('https://jerseystore-server.onrender.com/web/AddToCart', {
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
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
        accessibilityLabel="Go back"
      >
        <Ionicons name="chevron-back" size={55} color="#000" />
      </TouchableOpacity>

      <View style={styles.imageContainer}>
        <Image
          source={product.image ? { uri: product.image } : null}
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
          style={[styles.button, styles.createOrderButton]}
          onPress={handleCreateOrder}
        >
          <Text style={styles.buttonText}>Create Order</Text>
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
