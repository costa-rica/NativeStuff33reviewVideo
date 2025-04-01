import React, { useRef, useState } from "react";
import { Animated, Pressable } from "react-native";

// const ButtonKvImage = ({ onPress, color = "transparent", children }) => {
const ButtonKvImage = ({ onPress, style, children }) => {
  // Define default styles
  const defaultStyles = {
    color: "transparent",
    backgroundColor: currentColor,
    padding: 5,
    borderRadius: 35,
    // width: width,
    justifyContent: "center",
    alignItems: "center",
  };
  const mergedStyle = { ...defaultStyles, ...style };
  const scaleValue = useRef(new Animated.Value(1)).current;
  const [currentColor, setCurrentColor] = useState(mergedStyle.color);

  const handlePressIn = () => {
    setCurrentColor("gray"); // Change color on press
    Animated.spring(scaleValue, {
      toValue: 0.5,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    setCurrentColor(mergedStyle.color); // Revert color when press is released
    Animated.spring(scaleValue, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();

    // Call the onPress function passed as a prop
    if (onPress) {
      onPress();
    }
  };

  // const styleView = {
  //   backgroundColor: currentColor,
  //   padding: 5,
  //   borderRadius: 35,
  //   // width: width,
  //   justifyContent: "center",
  //   alignItems: "center",
  // };

  return (
    <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        // style={{ alignItems: "center", justifyContent: "center" }}
        style={mergedStyle}
      >
        {/* <FontAwesomeIcon icon={faX} size={size} color={currentColor} />  */}
        {children}
      </Pressable>
    </Animated.View>
  );
};

export default ButtonKvImage;
