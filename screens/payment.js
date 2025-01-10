import { View, Text, Alert, StyleSheet, TouchableOpacity, BackHandler } from 'react-native'
import React, { useRef, useEffect } from 'react'
import { useRoute } from '@react-navigation/native'
import WebView from 'react-native-webview'
import { useNavigation } from '@react-navigation/native'
import axios from 'axios'
const paymongoAPIKey = 'sk_test_vcNRX3jputurLKGX1jXravqS';
import api_url from '../api'

const Payment = () => {
    const nav = useNavigation()
    const router = useRoute();
    const { paymentInfo, orderData } = router.params;
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


    const insertOrder = async () => {
        try {
            const response = await fetch(`${api_url}/web/CreateOrders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData),
            });
    
            const responseData = await response.json();
    
            console.log('Response status:', response.status); // Log HTTP status
            console.log('Response data:', responseData); // Log the entire response
    
            if (response.ok && responseData.order && responseData.order._id) {
                Alert.alert(
                    'Payment Successful',
                    'Your payment was successful! Order successfully created!',
                    [
                        {
                            text: 'OK',
                            onPress: () => {
                                nav.navigate("Dashboard");
                            }
                        }
                    ]
                );
            } else {
                const errorMessage = responseData.message || `Unexpected error: ${response.status}`;
                Alert.alert('Failed to create order', errorMessage);
            }
        } catch (error) {
            console.error('Error:', error);
            Alert.alert('Failed to create order', 'An unexpected error occurred.');
        }
    };
    

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

export default Payment

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