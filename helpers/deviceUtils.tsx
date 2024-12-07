// utils/deviceUtils.ts

import { Dimensions, Platform, PixelRatio } from "react-native";

// Get device dimensions
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// Scale factor based on standard screen width (360)
const scale = SCREEN_WIDTH / 360;

// Normalize function to scale sizes across devices
const normalize = (size: number) => {
  return Math.round(size * scale);
};

// Get device's pixel ratio
const pixelRatio = PixelRatio.get();

// Use for font scaling
const fontScale = pixelRatio > 2 ? pixelRatio / 2 : 1;

// Normalize font size
const normalizeFontSize = (size: number) => {
  return Math.round(size * fontScale);
};

export { SCREEN_WIDTH, SCREEN_HEIGHT, normalize, normalizeFontSize };
