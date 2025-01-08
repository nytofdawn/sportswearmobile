import React, { useState, useEffect } from 'react';
import { View, FlatList, Image, StyleSheet, TouchableOpacity, Text, ImageBackground, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

import background from '../images/backgroundall.png';

const DashboardScreen = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('https://jerseystore-server.onrender.com/web/products', {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        setProducts(response.data.products);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
  
    fetchProducts();
  }, []);
  

  // Filter products based on the search query
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const listahan =() => {
    navigation.navigate('Orderko');
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
  style={styles.productContainer}
  onPress={() => {
    console.log('Navigating with product:', item); // Debug log
    navigation.navigate('ProductView', { product: item });
  }}
>
  <Image
    source={{ uri: item.image }}
    style={styles.productImage}
  />
  <Text style={styles.productName}>{item.name}</Text>
  <Text style={styles.productPrice}>Php: {item.price}</Text>
</TouchableOpacity>

  );

  return (
    <ImageBackground source={background} style={styles.container} resizeMode="cover">
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search Products"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
            <TouchableOpacity style={styles.icon}
            onPress={() => navigation.navigate('Notification')}>
              <Ionicons name="notifications" size={30} color="black" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.icon}
            onPress={()=>navigation.navigate('Karton')}>
              <Ionicons name="cart" size={30} color="black" />
            </TouchableOpacity>
          </View>
          
        </View>

        <View style={styles.hatdog}>
          <TouchableOpacity style={styles.icon}
          onPress={() => navigation.navigate('Profile')}>
            <Ionicons name="person" size={35} color="black" />
          </TouchableOpacity>
          <Text style={styles.allProductsText}>
            All Products
          </Text>
          <TouchableOpacity style={styles.icon}
          onPress={listahan}>
            <Ionicons name="list" size={35} color="black" />
          </TouchableOpacity>
        </View>

        <FlatList
  data={filteredProducts}
  keyExtractor={(item) => (item._id ? item._id.toString() : Math.random().toString())}
  numColumns={2}
  renderItem={renderItem}
  contentContainerStyle={styles.productList}
/>

      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginTop:40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start', // Align icons to the left
  },
  icon: {
    marginHorizontal: 16,  // Adds equal space around the icons
  },
  searchContainer: {
    flex: 1,
    marginLeft: 10, // Space between icons and the search bar
    marginRight: 10, // Space between search bar and other icons
  },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 20,
    paddingLeft: 16,
    backgroundColor: '#fff',
  },
  productList: {
    padding: 16,
  },
  productContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
    marginHorizontal: 8,
    backgroundColor: 'rgba(255, 160, 122, 0.2)',
    borderRadius: 25,
    padding: 10,
    borderColor: 'black',
    borderWidth: 2,
  },
  productImage: {
    width: '100%',
    height: 120,
    resizeMode: 'contain',
  },
  productName: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: 'bold',
  },
  productPrice: {
    fontSize: 14,
    color: '#888',
  },
  hatdog: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    marginRight: 16,
  },
  allProductsText: {
    marginLeft: 10,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default DashboardScreen;
