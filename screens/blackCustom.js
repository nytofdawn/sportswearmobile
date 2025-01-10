import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert, TextInput, ImageBackground, ScrollView } from 'react-native'; // Import ScrollView
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
const paymongoAPIKey = 'sk_test_vcNRX3jputurLKGX1jXravqS';

const backgroundimg = require('../images/backgroundall.png');

const BlankCanvas = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [productDetails, setProductDetails] = useState({
    email: '',
    imgUrl: '',
    logoUrl: '',
    size: '',
    description: '',
    notes: '',
    color: '',
    price: 0,
  });
  const [logoImage, setLogoImage] = useState(null);  // For logo image

  useEffect(() => {
    if (route.params?.product) {
      const { product } = route.params;
      setProductDetails({
        name: product.name,
        email: product.email,
        imgUrl: product.image,
        size: product.size,
        description: product.description,
        color: product.color,
        price: product.price,
        productID: product.productID,  // Added to ensure productID is included
      });
    }

    const getEmailFromAsyncStorage = async () => {
      try {
        const userEmail = await AsyncStorage.getItem('userEmail');
        if (userEmail) {
          setProductDetails((prevState) => ({
            ...prevState,
            email: userEmail,
          }));
        }
      } catch (error) {
        console.log('Error retrieving email from AsyncStorage: ', error);
      }
    };
    getEmailFromAsyncStorage();
  }, [route.params]);

  const pickLogo = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access the camera roll is required!');
      return;
    }
  
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
  
    if (!result.canceled && result.assets && result.assets.length > 0) {
      // Access the URI from the first item in the assets array
      const imageUri = result.assets[0].uri;
      setLogoImage(imageUri);  // Store the logo image URI
      console.log('Logo URI:', imageUri);  // Log the URI to check
    } else {
      console.log('Image picker was cancelled or no assets found');
    }
  };
  

  const uploadImage = async (imageUri) => {
    const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/djfvjomng/image/upload"; // Cloudinary API URL
    const CLOUDINARY_UPLOAD_PRESET = "jerseymob"; // Use the preset created in Cloudinary
  
    const formData = new FormData();
    formData.append("file", {
      uri: imageUri,
      name: "image.jpg", // You can use dynamic naming if you need
      type: "image/jpeg", // Ensure that the MIME type is correct
    });
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET); // Add upload preset
  
    console.log("Uploading image:", imageUri); // Log the image URI before uploading
  
    try {
      const response = await fetch(CLOUDINARY_URL, {
        method: "POST",
        body: formData,
      });
  
      const data = await response.json();
      if (data?.secure_url) {
        console.log("Image uploaded successfully!", data.secure_url); // Log the secure URL of the uploaded image
        return data.secure_url; // Assuming the server responds with the secure image URL
      } else {
        console.error('Failed to upload image:', data.error || 'Unknown error');
        return '';
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      return '';
    }
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

  const handleSubmit = async () => {
    // Ensure required fields are filled in
    if (!productDetails.email || !productDetails.size || !productDetails.description || !productDetails.color || !productDetails.name || !productDetails.price) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }

    let logoUrl = productDetails.logoUrl || '';

    // Upload logo image if selected
    if (logoImage) {
      logoUrl = await uploadImage(logoImage);
    }

    const productDataToSubmit = {
      name: productDetails.name,
      email: productDetails.email,
      imgUrl: productDetails.imgUrl,  // Use the imgUrl from the product details (no need to upload again)
      logoUrl: logoUrl,
      size: productDetails.size,
      description: productDetails.description,
      notes: productDetails.notes,
      color: productDetails.color,
      price: productDetails.price,
    };

    createPaymentLink().then(res => {
      navigation.navigate("BCPayment", { paymentInfo: res, productData: productDataToSubmit, productDetails: productDetails });
    });
  };

  return (
    <ImageBackground
      source={backgroundimg} // Assign the imported background image
      style={styles.container} // Apply your styles
    >
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backIconContainer}>
          <View style={styles.circle}>
            <Icon name="chevron-back" size={50} color="#fff" />
          </View>
        </TouchableOpacity>

        <Text style={styles.headerText}>Customize Your Product</Text>

        {productDetails.email ? (
          <Text style={styles.emailText}>Email: {productDetails.email}</Text>
        ) : (
          <Text style={styles.emailText}>Loading email...</Text>
        )}

        {/* Display selected product image from product details */}
        {productDetails.imgUrl ? (
          <Image source={{ uri: productDetails.imgUrl }} style={styles.imagePreview} />
        ) : (
          <Text>No product image available</Text>
        )}

        {/* Display selected logo image preview */}
        {logoImage ? (
          <Image source={{ uri: logoImage }} style={styles.imagePreview} />
        ) : (
          <Text>No logo image selected</Text>
        )}

        <TouchableOpacity style={styles.imagePickerButton} onPress={pickLogo}>
          <Text style={styles.buttonText}>Pick a Logo</Text>
        </TouchableOpacity>

        <Text style={styles.text}>Size: {productDetails.size}</Text>
        <Text style={styles.text}>Price: PHP{productDetails.price}</Text>

        <TextInput 
          style={styles.input} 
          placeholder="Enter description" 
          value={productDetails.description} 
          onChangeText={(text) => setProductDetails({ ...productDetails, description: text })}
        />

        <TextInput 
          style={styles.input} 
          placeholder="Enter notes" 
          value={productDetails.notes} 
          onChangeText={(text) => setProductDetails({ ...productDetails, notes: text })}
        />

        <TextInput 
          style={styles.input} 
          placeholder="Enter color" 
          value={productDetails.color} 
          onChangeText={(text) => setProductDetails({ ...productDetails, color: text })}
        />

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
  },
  scrollViewContent: {
    flexGrow: 1, // Ensures content can scroll
    paddingBottom: 30, // Adds some space at the bottom for comfortable scrolling
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
  headerText: {
    fontSize: 24,
    marginTop:25,
    marginLeft:25,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  emailText: {
    fontSize: 16,
    marginBottom: 10,
  },
  imagePreview: {
    width: 150,
    height: 150,
    marginVertical: 10,
    borderRadius: 10,
    backgroundColor: '#ddd',
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    fontSize: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 5,
  },
  submitButton: {
    backgroundColor: '#28a745',
    padding: 10,
    marginTop: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  imagePickerButton: {
    backgroundColor: '#007bff',
    padding: 10,
    marginTop: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
});

export default BlankCanvas;
