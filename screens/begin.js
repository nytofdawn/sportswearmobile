import React from 'react';
import { View, Text, StyleSheet, Image, ImageBackground, TouchableOpacity } from 'react-native';

import logo from '../images/logo.png';
import backg from '../images/backgroundall.png';
import footerImage from '../images/begin.png';

export default function BeginScreen({ navigation }) {
  return (   
    <ImageBackground source={backg} style={styles.background}>
      <TouchableOpacity style={styles.overlay}  onPress={() => navigation.navigate('Login')}>
        <View style={styles.overlay}>
          <View style={styles.logoContainer}>
            <Image source={logo} style={styles.logo} />
          </View>
          
          <View style={styles.content}>
            <Text style={styles.miniTitle}>
              Elevate your game with our premium sportswear, designed to help you perform at your best.
            </Text>
          </View>

          <View style={styles.footerContainer}>
            <View style={styles.footerImageContainer}>
              <Image source={footerImage} style={styles.footerImage} />
              <Text style={styles.footerText}>
                Success is no accident. It is hard work, perseverance learning, studying, 
                sacrifice, and most of all, love
                of what you are doing or learning to do.
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  overlay: {
    flex: 1,
    justifyContent: 'space-between',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 50,
    padding: 30,
  },
  logo: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  miniTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  footerContainer: {
    position: 'relative',  // Keep the footer container for layout
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  footerImageContainer: {
    position: 'relative', 
  },
  footerImage: {
    width: 450,
    height:450,
    resizeMode: 'cover',
  },
  footerText: {
    position: 'absolute', // Overlay the text over the image
    top: 200,  // Adjust position of the text
    left:70,
    right: 110,
    marginRight:100,
    fontSize: 20,
    color: 'black',  
    textAlign: 'center',
    zIndex: 1, 
  },
});
