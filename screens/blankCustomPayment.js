import { View, Text, Alert, StyleSheet, TouchableOpacity, BackHandler } from 'react-native';
import React, { useRef, useEffect } from 'react'
import WebView from 'react-native-webview'
import { useNavigation, useRoute } from '@react-navigation/native'
import axios from 'axios'
const paymongoAPIKey = 'sk_test_vcNRX3jputurLKGX1jXravqS';

const BlankCustomPayment = () => {
    const nav = useNavigation();
    const router = useRoute();
    const { paymentInfo, productData } = router.params;
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
            const createResponse = await fetch('https://jerseystore-server.onrender.com/web/createdesign', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(productData),
            });

            const createData = await createResponse.json();
            if (createResponse.ok) {
                Alert.alert(
                    'Success',
                    'Product details submitted successfully!',
                    [
                        {
                            text: 'OK',
                            onPress: () => {
                                nav.navigate("Dashboard");

                            }
                        }
                    ]
                );
                console.log('Product details:', createData);
                nav.goBack();
            } else {
                Alert.alert('Error', `Failed to submit product details: ${createData.message}`);
                console.log('Failed to submit product details:', createData);
            }
        } catch (error) {
            console.error('Error submitting product details:', error);
            Alert.alert('Error', 'An error occurred while submitting the product details.');
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

export default BlankCustomPayment

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