import stc from "string-to-color";
import { colors } from "../config/colors";

type RgbColor = {
  r: number;
  g: number;
  b: number;
};

export const findClosestColor = (
  hexColor: string,
  colors: Record<string, string>
): string | undefined => {
  const rgbColor = hexToRgb(hexColor);
  let closestColor;
  let closestDistance = Number.MAX_VALUE;
  for (const colorName in colors) {
    const colorValue = colors[colorName];
    const colorDistance = getColorDistance(rgbColor, hexToRgb(colorValue));
    if (colorDistance < closestDistance) {
      closestDistance = colorDistance;
      closestColor = colorName;
    }
  }
  return closestColor;
};

const hexToRgb = (hexColor: string): RgbColor => ({
  r: parseInt(hexColor.slice(1, 3), 16),
  g: parseInt(hexColor.slice(3, 5), 16),
  b: parseInt(hexColor.slice(5, 7), 16),
});

const rgbToHex = ({ r, g, b }: RgbColor): string =>
  "#" + ((r << 16) | (g << 8) | b).toString(16).padStart(6, "0");

const getColorDistance = (color1: RgbColor, color2: RgbColor): number => {
  const rDiff = color1.r - color2.r;
  const gDiff = color1.g - color2.g;
  const bDiff = color1.b - color2.b;
  return Math.sqrt(
    Math.pow(rDiff, 2) + Math.pow(gDiff, 2) + Math.pow(bDiff, 2)
  );
};

const normalize = (value: number, min: number, max: number): number => {
  const percent = value / 256;
  const maxNewMeasure = -min + max;
  const newValue = maxNewMeasure * percent;
  return newValue + min;
};

export const normalizeColor = (
  value: string,
  colors: Record<string, string>
): string => {
  const rgbValue = hexToRgb(value);
  const rgbColors = Object.values(colors).map(hexToRgb);

  const minVector = rgbColors.reduce((acc, cur) => ({
    r: Math.min(acc.r, cur.r),
    g: Math.min(acc.g, cur.g),
    b: Math.min(acc.b, cur.b),
  }));

  const maxVector = rgbColors.reduce((acc, cur) => ({
    r: Math.max(acc.r, cur.r),
    g: Math.max(acc.g, cur.g),
    b: Math.max(acc.b, cur.b),
  }));

  const normalizedVector = {
    r: normalize(rgbValue.r, minVector.r, maxVector.r),
    g: normalize(rgbValue.g, minVector.g, maxVector.g),
    b: normalize(rgbValue.b, minVector.b, maxVector.b),
  };

  const result = rgbToHex(normalizedVector);
  return result;
};

export const computeColorByString = (value: string): string =>
  normalizeColor(stc(value), colors);
