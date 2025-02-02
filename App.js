import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BeginScreen from './screens/begin';
import LoginScreen from './screens/login';
import DashboardScreen from './screens/dashboard';
import ProductViewScreen from './screens/productview';
// import BuyNowScreen from './screens/Buynow';
import BlankCanvas from './screens/blackCustom';
// import FormScreen from './screens/Upload';
import FetchOrderScreen from './icons/fetchorder.js';
import ProfileScreen from './icons/profile';
import NotificationScreen from './icons/notif.js';
import CartScreen from './icons/addtocart.js';
import Payment from './screens/payment.js';
import BCPayment from './screens/blankCustomPayment.js'
import CartPay from './icons/addtocartPayment.js';
import AddressAndDeliveryScreen from './screens/addressanddelivery.js';
import ForgotPasswordScreen from './screens/forgotpass.js';

const Stack = createStackNavigator();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Begin"
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="Begin" component={BeginScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Dashboard" component={DashboardScreen} />
          <Stack.Screen name="ProductView" component={ProductViewScreen} />
          {/* <Stack.Screen name="Buy" component={BuyNowScreen}/> */}
          <Stack.Screen name="Blank" component={BlankCanvas} />
          {/* <Stack.Screen name="Upload" component={FormScreen} /> */}
          <Stack.Screen name="Orderko" component={FetchOrderScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="Notification" component={NotificationScreen} />
          <Stack.Screen name="AddressAndDeliveryScreen" component={AddressAndDeliveryScreen} />
          <Stack.Screen name="forgotpass" component={ForgotPasswordScreen} />
          <Stack.Screen name="Karton" component={CartScreen} />
          <Stack.Screen name="Payment" component={Payment} />
          <Stack.Screen name="BCPayment" component={BCPayment} />
          <Stack.Screen name="CartPay" component={CartPay} />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
