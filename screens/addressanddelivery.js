import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
  ImageBackground,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

// Import the background image
const bmg = require('../images/backgroundall.png');

const AddressAndDeliveryScreen = ({ route }) => {
  const [city, setCity] = useState('');
  const [barangay, setBarangay] = useState('');
  const [block, setBlock] = useState('');
  const [lot, setLot] = useState('');
  const [province, setProvince] = useState('');
  const [deliveryOption, setDeliveryOption] = useState('');

  const navigation = useNavigation();

  const handleConfirm = () => {
    if (!city.trim() || !barangay.trim() || !block.trim() || !lot.trim() || !province.trim()) {
      Alert.alert('Error', 'Please fill in all address fields.');
      return;
    }
    if (!deliveryOption) {
      Alert.alert('Error', 'Please select a delivery option.');
      return;
    }

    const address = { city, barangay, block, lot, province };

    // Pass the data back to ProductViewScreen
    navigation.navigate('ProductView', {
      ...route.params, // Include the product data
      address,
      deliveryOption,
    });
  };

  return (
    <ImageBackground source={bmg} style={styles.backgroundImage}>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backIconContainer}>
                <View style={styles.circle}>
                  <Icon name="chevron-back" size={50} color="#fff" />
                </View>
              </TouchableOpacity>
        <Text style={styles.title}>Enter Delivery Details</Text>

        <TextInput
          style={styles.input}
          placeholder="City"
          value={city}
          onChangeText={setCity}
        />
        <TextInput
          style={styles.input}
          placeholder="Barangay"
          value={barangay}
          onChangeText={setBarangay}
        />
        <TextInput
          style={styles.input}
          placeholder="Block"
          value={block}
          onChangeText={setBlock}
        />
        <TextInput
          style={styles.input}
          placeholder="Lot"
          value={lot}
          onChangeText={setLot}
        />
        <TextInput
          style={styles.input}
          placeholder="Province"
          value={province}
          onChangeText={setProvince}
        />

        <Text style={styles.subtitle}>Select Delivery Option</Text>

        <TouchableOpacity
          style={[styles.option, deliveryOption === 'Door-to-Door' && styles.optionSelected]}
          onPress={() => setDeliveryOption('Door-to-Door')}
        >
          <Text
            style={[styles.optionText, deliveryOption === 'Door-to-Door' && styles.optionTextSelected]}
          >
            Door-to-Door
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.option, deliveryOption === 'Pickup' && styles.optionSelected]}
          onPress={() => setDeliveryOption('Pickup')}
        >
          <Text
            style={[styles.optionText, deliveryOption === 'Pickup' && styles.optionTextSelected]}
          >
            Pickup
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
          <Text style={styles.confirmButtonText}>Confirm</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center', // Ensures content is centered in the background
  },
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.29)', // Semi-transparent white background
    borderRadius: 10,
    marginTop: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 60,
    color: '#333',
  },
  input: {
    width: width * 0.9,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  option: {
    width: width * 0.9,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  optionSelected: {
    borderColor: '#28a745',
    backgroundColor: '#dff0d8',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  optionTextSelected: {
    color: '#28a745',
    fontWeight: 'bold',
  },
  confirmButton: {
    marginTop: 20,
    paddingVertical: 15,
    width: width * 0.9,
    backgroundColor: '#007bff',
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  backIconContainer: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10,
  },
  circle: {
    width: 60, // Size of the circle
    height: 60, // Size of the circle
    borderRadius: 30, // Make it circular
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // Background color of the circle
    justifyContent: 'center', // Center the icon
    alignItems: 'center', // Center the icon
  },
});

export default AddressAndDeliveryScreen;
