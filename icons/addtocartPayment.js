import { View, Text, Alert, StyleSheet, TouchableOpacity, BackHandler } from 'react-native';
import React, { useRef, useEffect } from 'react'
import WebView from 'react-native-webview'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native'
import axios from 'axios'
const paymongoAPIKey = 'sk_test_vcNRX3jputurLKGX1jXravqS';

const AddtocartPayment = () => {
    const nav = useNavigation();
    const router = useRoute();
    const { paymentInfo, data, product } = router.params;
    const webViewRef = useRef(null);

    const archivePMLink = async () => {
        try {
            console.log(paymentInfo.paymentLinkID)
            const res = await axios.post(`https://api.paymongo.com/v1/links/${paymentInfo.paymentLinkID}/archive`, {}, {
                headers: {
                    Authorization: `Basic ${btoa(paymongoAPIKey + ':')}`,
                    'Content-Type': 'application/json'
                }
            });
            // console.log(res.data);
        } catch (error) {
            console.error('Error archiving payment link:', error);
        }
    }

    const handleBackButton = () => {
        if (webViewRef.current) {
            webViewRef.current.goBack(); // Go back in WebView history
            Alert.alert("Hold on!", "You can't go back while the payment is in progress.", [
                { text: "OK", onPress: () => null }
            ]);

            return true; // Prevent default back action
        }
    };

    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackButton);

        return () => {
            backHandler.remove(); // Clean up the event listener on unmount
        };
    }, []);

    const handleCancel = () => {
        Alert.alert(
            'Cancel Payment',
            'Are you sure you want to cancel the payment?',
            [
                {
                    text: 'Yes', onPress: () => {
                        archivePMLink();
                        nav.goBack();
                    }
                },
                {
                    text: 'No',
                }

            ],
            { cancelable: false }
        );
    };

    const handleDeleteItem = async (itemId) => {
        try {
          const storedUserId = await AsyncStorage.getItem('userId');
          if (!storedUserId) {
            Alert.alert('Error', 'User not logged in.');
            return;
          }
    
          const response = await axios.delete('https://jerseystore-server.onrender.com/web/deleteFromCart', {
            data: { userID: storedUserId, productID: itemId },
          });
    
          if (response.data.status === 'success') {
            // Immediately update the cart items state to remove the deleted item
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

    const insertOrder = async () => {
        try {
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
                // Remove the item from the cart after a successful purchase
                handleDeleteItem(product._id || product.productID?._id);
            } else {
                const errorMessage = responseData.message || `Unexpected error: ${response.status}`;
                alert('Failed to create order: ' + errorMessage);
            }
        } catch (error) {
            console.error('Error creating order:', error);
            alert('An error occurred while creating the order.');
        }
    }

    return (
        <View style={{ flex: 1 }}>
            <WebView
                ref={webViewRef}
                source={{ uri: paymentInfo.paymentLinkUrl }}
                style={{ height: '' }}
                onNavigationStateChange={(navState) => {
                    if (navState.url.includes('success')) {
                        insertOrder();
                        nav.goBack();
                    } else if (navState.url.includes('cancel')) {
                        Alert.alert('Payment Cancelled', 'Your payment was cancelled.');
                        nav.goBack(); // Navigate back after cancellation
                    }
                }}
            />
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                <Text style={styles.cancelButtonText}>Cancel Payment</Text>
            </TouchableOpacity>
        </View>
    )
}

export default AddtocartPayment

const styles = StyleSheet.create({
    cancelButton: {
        backgroundColor: 'red',
        padding: 10,
        alignItems: 'center',
        borderRadius: 5,
        margin: 10,
    },
    cancelButtonText: {
        color: 'white',
        fontSize: 16,
    },
});