import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

const FormScreen = ({ navigation }) => {
  const [userId, setUserId] = useState('');  // State for userId
  const [size, setSize] = useState('');
  const [color, setColor] = useState('');
  const [quantity, setQuantity] = useState('');
  const [lastname, setLastname] = useState('');
  const [jerseyNumber, setJerseyNumber] = useState('');
  const [logo, setLogo] = useState(null); // Store image URI
  const [notes, setNotes] = useState('');

  // Retrieve userId from AsyncStorage when component mounts
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        if (storedUserId) {
          setUserId(storedUserId);  // Set the userId state
        } else {
          Alert.alert('User ID not found in AsyncStorage');
        }
      } catch (error) {
        console.error('Error fetching user ID from AsyncStorage:', error);
      }
    };

    fetchUserId(); // Call the function to fetch userId
  }, []);

  const handleImageUpload = async () => {
    console.log('Upload button pressed!');
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert('Permission required', 'Permission to access camera roll is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Image,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setLogo(result.assets[0].uri); // Set the URI of the selected image
      console.log('Selected image URI:', result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!logo) {
      alert('Please upload a logo.');
      return;
    }
  
    if (!userId) {
      alert('User ID is required.');
      return;
    }
  
    try {
      // Function to determine MIME type based on file extension
      const getFileType = (uri) => {
        const ext = uri.split('.').pop().toLowerCase();
        if (ext === 'jpg' || ext === 'jpeg') return 'jpeg';
        if (ext === 'png') return 'png';
        return 'jpeg'; // Default to jpeg if unsure
      };
  
      // Read the image file as a base64 string
      const base64Logo = await FileSystem.readAsStringAsync(logo, {
        encoding: FileSystem.EncodingType.Base64,
      });
  
      // Determine the file type from the file extension
      const fileType = getFileType(logo);
  
      // Ensure the base64 string is formatted correctly with MIME type
      const logoData = `data:image/${fileType};base64,${base64Logo}`;
  
      // Prepare the form data, including the base64 image with the correct prefix
      const formData = {
        user_id: userId,
        size,
        color,
        quantity,
        lastname,
        jerseyNumber,
        logo: logoData,  // Ensure proper base64 format
        notes,
      };
  
      // Send the request to PHP backend
      const response = await fetch('http://jerseyshop.iceiy.com/customdesign.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': '__test=825aa7e027e495727ec5d3e75428b531', // Keep the cookie in the header
          'Host': 'jerseyshop.iceiy.com',
          'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
        },
        body: JSON.stringify(formData),
      });
  
      const responseBody = await response.text();
      const jsonResponse = JSON.parse(responseBody);
      navigation.navigate('Dashboard');
  
      if (jsonResponse.status === 'success') {
        alert('Custom design submitted successfully!');
      } else {
        alert(`Error: ${jsonResponse.message}`);
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('Failed to submit the form. Please try again.');
    }
  };


  return (
    <View style={styles.screen}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="chevron-back" size={30} color="#000" />
      </TouchableOpacity>

      <ScrollView style={styles.container}>
        <Text style={styles.header}>Player Information</Text>

        {/* Removed User ID input field as it will be retrieved from AsyncStorage */}

        <TextInput
          style={styles.input}
          placeholder="Size"
          value={size}
          onChangeText={setSize}
        />
        <TextInput
          style={styles.input}
          placeholder="Color"
          value={color}
          onChangeText={setColor}
        />
        <TextInput
          style={styles.input}
          placeholder="Quantity"
          value={quantity}
          onChangeText={setQuantity}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Last Name"
          value={lastname}
          onChangeText={setLastname}
        />
        <TextInput
          style={styles.input}
          placeholder="Jersey Number"
          value={jerseyNumber}
          onChangeText={setJerseyNumber}
          keyboardType="numeric"
        />

        <View style={styles.imageUploadContainer}>
          <Button title="Upload Logo" onPress={handleImageUpload} />
          {logo && <Image source={{ uri: logo }} style={styles.imagePreview} />}
        </View>

        <TextInput
          style={[styles.input, styles.notesInput]}
          placeholder="Notes"
          value={notes}
          onChangeText={setNotes}
          multiline
        />

        <Button title="Submit" onPress={handleSubmit} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fff',
  },
  backButton: {
    marginTop: 40,
    marginLeft: 10,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 12,
    paddingLeft: 8,
  },
  notesInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  imageUploadContainer: {
    marginBottom: 16,
    alignItems: 'center',
  },
  imagePreview: {
    width: 100,
    height: 100,
    marginTop: 10,
    borderRadius: 8,
  },
});

export default FormScreen;