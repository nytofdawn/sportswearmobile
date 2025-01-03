import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, PanResponder, Text, TextInput, TouchableOpacity, Dimensions, Alert, ImageBackground } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import background from '../images/backgroundall.png';

const BlankCanvas = ({ navigation }) => {
  const [shapes, setShapes] = useState([]);
  const shapeContainerRef = useRef(); // Create a reference to the shape container

  const containerWidth = Dimensions.get('window').width - 40;
  const containerHeight = Dimensions.get('window').height - 40;

  useEffect(() => {
    // Show an alert when entering the BlankCanvas
    Alert.alert("Notice", "Please screenshot your logo after creation.");
  }, []);

  const addShape = (type) => {
    const newShape = {
      id: shapes.length + 1,
      x: 20,
      y: 20,
      type,
      text: type === 'text' ? 'Editable Text' : '',
    };
    setShapes((prevShapes) => [...prevShapes, newShape]);
  };

  const clearAllShapes = () => {
    setShapes([]);
  };

  const panResponder = (id) =>
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gestureState) => {
        const shape = shapes.find((shape) => shape.id === id);
        const newX = Math.max(0, Math.min(containerWidth - 120, shape.x + gestureState.dx));
        const newY = Math.max(0, Math.min(containerHeight - 80, shape.y + gestureState.dy));
        setShapes((currentShapes) =>
          currentShapes.map((shape) =>
            shape.id === id
              ? { ...shape, x: newX, y: newY }
              : shape
          )
        );
      },
    });

  const renderShape = (shape) => {
    switch (shape.type) {
      case 'circle':
        return (
          <View
            key={shape.id}
            style={[styles.circle, { left: shape.x, top: shape.y }]}
            {...panResponder(shape.id).panHandlers}
          />
        );
      case 'rectangle':
        return (
          <View
            key={shape.id}
            style={[styles.rectangle, { left: shape.x, top: shape.y }]}
            {...panResponder(shape.id).panHandlers}
          />
        );
      case 'triangle':
        return (
          <View
            key={shape.id}
            style={[styles.triangle, { left: shape.x, top: shape.y }]}
            {...panResponder(shape.id).panHandlers}
          />
        );
      case 'text':
        return (
          <View
            key={shape.id}
            style={[styles.textShape, { left: shape.x, top: shape.y }]}
            {...panResponder(shape.id).panHandlers}
          >
            <TextInput
              style={styles.textInput}
              value={shape.text}
              onChangeText={(newText) =>
                setShapes((currentShapes) =>
                  currentShapes.map((item) =>
                    item.id === shape.id ? { ...item, text: newText } : item
                  )
                )
              }
            />
          </View>
        );
      default:
        return null;
    }
  };

  const handleNext = () => {
    Alert.alert(
      'Confirm Screenshot',
      'Please make sure you have taken a screenshot of your work. Do you want to proceed?',
      [
        {
          text: 'Cancel',
          style: 'cancel', // The action when the user chooses to cancel
        },
        {
          text: 'Confirm',
          onPress: () => {
            navigation.navigate('Upload');
            console.log('Next button pressed');
          },
        },
      ],
      { cancelable: false } // Prevents dismissing the alert by tapping outside
    );
  };
  

  return (
    <ImageBackground source={background} style={styles.canvas} resizeMode="cover">
      <View style={styles.header}>
        <Text style={styles.headerText}>Screenshot your design before NEXT</Text>
      </View>

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="chevron-back" size={30} color="black" />
      </TouchableOpacity>

      {/* Shape container with ref for capturing */}
      <View style={styles.shapeContainer} ref={shapeContainerRef}>
        {shapes.map((shape) => renderShape(shape))}
      </View>

      {/* Buttons to add shapes */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={() => addShape('circle')} style={styles.addButton}>
          <Text>+ Add Cir</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => addShape('rectangle')} style={styles.addButton}>
          <Text>+ Add Rec</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => addShape('triangle')} style={styles.addButton}>
          <Text>+ Add Tri</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => addShape('text')} style={styles.addButton}>
          <Text>+ Add Txt</Text>
        </TouchableOpacity>
      </View>

      {/* Next Button */}
      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.nextButtonText}>Next</Text>
      </TouchableOpacity>

      {/* Clear all button */}
      <TouchableOpacity onPress={clearAllShapes} style={styles.clearButton}>
        <Text style={styles.clearButtonText}>Clear All</Text>
      </TouchableOpacity>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  canvas: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#ff8c00',
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  headerText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 3,
    backgroundColor: '#fff',
    borderRadius: 50,
    padding: 5,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  shapeContainer: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#000',
    margin: 20,
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
    position: 'relative',
  },
  circle: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'tomato',
  },
  rectangle: {
    position: 'absolute',
    width: 120,
    height: 80,
    backgroundColor: 'skyblue',
  },
  triangle: {
    position: 'absolute',
    width: 0,
    height: 0,
    borderLeftWidth: 60,
    borderRightWidth: 60,
    borderBottomWidth: 100,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'green',
  },
  textShape: {
    position: 'absolute',
    backgroundColor: 'transparent',
    padding: 5,
  },
  textInput: {
    fontSize: 40,
    color: 'black',
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: '#ddd',
    padding: 10,
    margin: 5,
    borderRadius: 5,
  },
  nextButton: {
    backgroundColor: 'blue',
    padding: 15,
    margin: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  clearButton: {
    backgroundColor: 'red',
    padding: 10,
    margin: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  clearButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default BlankCanvas;
