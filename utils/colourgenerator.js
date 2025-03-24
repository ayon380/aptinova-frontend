import {
  argbFromRgb,
  hexFromArgb,
  themeFromSourceColor,
  sourceColorFromImage,
} from '@material/material-color-utilities';

/**
 * Extracts the dominant color from an image
 * @param {string} imageUrl - URL or data URL of the image
 * @returns {Promise<number>} - Source color as ARGB integer
 */
export const extractColorFromImage = async (imageUrl) => {
  try {
    // Create an image element
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    
    // Wait for the image to load
    const imageLoadPromise = new Promise((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = imageUrl;
    });
    
    await imageLoadPromise;
    
    // Extract the source color from the image
    const sourceColor = await sourceColorFromImage(img);
    return sourceColor;
  } catch (error) {
    console.error('Error extracting color from image:', error);
    // Return a default color if extraction fails
    return argbFromRgb(33, 150, 243); // Default blue
  }
};

/**
 * Default Material You color scheme for use when no image is provided
 */
export const defaultColorScheme = {
  sourceColor: "#6200EA", // Purple
  lightTheme: {
    primary: "#6200EA",
    onPrimary: "#FFFFFF",
    primaryContainer: "#BB86FC",
    onPrimaryContainer: "#3700B3",
    secondary: "#03DAC6",
    onSecondary: "#000000",
    secondaryContainer: "#018786",
    onSecondaryContainer: "#03DAC6",
    tertiary: "#03DAC6",
    onTertiary: "#000000",
    tertiaryContainer: "#018786",
    onTertiaryContainer: "#03DAC6",
    error: "#B00020",
    onError: "#FFFFFF",
    errorContainer: "#CF6679",
    onErrorContainer: "#B00020",
    background: "#FFFFFF",
    onBackground: "#000000",
    surface: "#FFFFFF",
    onSurface: "#000000",
    surfaceVariant: "#F5F5F5",
    onSurfaceVariant: "#000000",
    outline: "#000000",
    outlineVariant: "#000000",
    shadow: "#000000",
    scrim: "#000000",
    inverseSurface: "#000000",
    inverseOnSurface: "#FFFFFF",
    inversePrimary: "#BB86FC",
  },
  darkTheme: {
    primary: "#BB86FC",
    onPrimary: "#3700B3",
    primaryContainer: "#6200EA",
    onPrimaryContainer: "#BB86FC",
    secondary: "#03DAC6",
    onSecondary: "#000000",
    secondaryContainer: "#03DAC6",
    onSecondaryContainer: "#018786",
    tertiary: "#03DAC6",
    onTertiary: "#000000",
    tertiaryContainer: "#03DAC6",
    onTertiaryContainer: "#018786",
    error: "#CF6679",
    onError: "#B00020",
    errorContainer: "#B00020",
    onErrorContainer: "#CF6679",
    background: "#000000",
    onBackground: "#FFFFFF",
    surface: "#000000",
    onSurface: "#FFFFFF",
    surfaceVariant: "#121212",
    onSurfaceVariant: "#FFFFFF",
    outline: "#FFFFFF",
    outlineVariant: "#FFFFFF",
    shadow: "#000000",
    scrim: "#000000",
    inverseSurface: "#FFFFFF",
    inverseOnSurface: "#000000",
    inversePrimary: "#6200EA",
  },
  palettes: {
    primary: {
      tone0: "#000000",
      tone10: "#3700B3",
      tone20: "#6200EA",
      tone30: "#BB86FC",
      tone40: "#BB86FC",
      tone50: "#BB86FC",
      tone60: "#BB86FC",
      tone70: "#BB86FC",
      tone80: "#BB86FC",
      tone90: "#BB86FC",
      tone95: "#BB86FC",
      tone99: "#BB86FC",
      tone100: "#FFFFFF",
    },
    secondary: {
      tone0: "#000000",
      tone10: "#018786",
      tone20: "#03DAC6",
      tone30: "#03DAC6",
      tone40: "#03DAC6",
      tone50: "#03DAC6",
      tone60: "#03DAC6",
      tone70: "#03DAC6",
      tone80: "#03DAC6",
      tone90: "#03DAC6",
      tone95: "#03DAC6",
      tone99: "#03DAC6",
      tone100: "#FFFFFF",
    },
    tertiary: {
      tone0: "#000000",
      tone10: "#018786",
      tone20: "#03DAC6",
      tone30: "#03DAC6",
      tone40: "#03DAC6",
      tone50: "#03DAC6",
      tone60: "#03DAC6",
      tone70: "#03DAC6",
      tone80: "#03DAC6",
      tone90: "#03DAC6",
      tone95: "#03DAC6",
      tone99: "#03DAC6",
      tone100: "#FFFFFF",
    },
    neutral: {
      tone0: "#000000",
      tone10: "#121212",
      tone20: "#1E1E1E",
      tone30: "#2C2C2C",
      tone40: "#3A3A3A",
      tone50: "#4A4A4A",
      tone60: "#5C5C5C",
      tone70: "#717171",
      tone80: "#8A8A8A",
      tone90: "#A3A3A3",
      tone95: "#D1D1D1",
      tone99: "#F5F5F5",
      tone100: "#FFFFFF",
    },
    neutralVariant: {
      tone0: "#000000",
      tone10: "#121212",
      tone20: "#1E1E1E",
      tone30: "#2C2C2C",
      tone40: "#3A3A3A",
      tone50: "#4A4A4A",
      tone60: "#5C5C5C",
      tone70: "#717171",
      tone80: "#8A8A8A",
      tone90: "#A3A3A3",
      tone95: "#D1D1D1",
      tone99: "#F5F5F5",
      tone100: "#FFFFFF",
    },
    error: {
      tone0: "#000000",
      tone10: "#B00020",
      tone20: "#CF6679",
      tone30: "#CF6679",
      tone40: "#CF6679",
      tone50: "#CF6679",
      tone60: "#CF6679",
      tone70: "#CF6679",
      tone80: "#CF6679",
      tone90: "#CF6679",
      tone95: "#CF6679",
      tone99: "#CF6679",
      tone100: "#FFFFFF",
    },
  },
  customColors: [],
  timestamp: new Date().toISOString(),
  meta: {
    imageUrl: "default",
    generatedWith: "@material/material-color-utilities",
  },
};

/**
 * Modified generateMaterialYouTheme to return a structure matching the defaultColorScheme
 * @param {string|number} source - Image URL or ARGB color value
 * @param {boolean} isDark - Whether to generate a dark theme
 * @returns {Promise<Object>} - Material You theme object
 */
export const generateMaterialYouTheme = async (source, isDark = false) => {
  try {
    // Handle either an image URL (string) or direct color value (number)
    const sourceColor = typeof source === 'string' 
      ? await extractColorFromImage(source)
      : source;
    
    // Generate the theme
    const theme = themeFromSourceColor(sourceColor);
    
    // Get both light and dark schemes
    const lightPalette = theme.schemes.light.toJSON();
    const darkPalette = theme.schemes.dark.toJSON();
    
    // Convert ARGB integers to hex for light theme
    const lightTheme = {};
    Object.entries(lightPalette).forEach(([key, value]) => {
      lightTheme[key] = hexFromArgb(value);
    });
    
    // Convert ARGB integers to hex for dark theme
    const darkTheme = {};
    Object.entries(darkPalette).forEach(([key, value]) => {
      darkTheme[key] = hexFromArgb(value);
    });
    
    // Create palette tone maps
    const createToneMap = (palette) => {
      const toneMap = {};
      for (let i = 0; i <= 100; i += 10) {
        if (i === 0 || i === 10 || i === 20 || i === 30 || i === 40 || i === 50 || 
            i === 60 || i === 70 || i === 80 || i === 90 || i === 95 || i === 99 || i === 100) {
          const toneName = `tone${i}`;
          toneMap[toneName] = hexFromArgb(palette.tone(i));
        }
      }
      return toneMap;
    };
    
    // Generate palette tone maps
    const palettes = {
      primary: createToneMap(theme.palettes.primary),
      secondary: createToneMap(theme.palettes.secondary),
      tertiary: createToneMap(theme.palettes.tertiary),
      neutral: createToneMap(theme.palettes.neutral),
      neutralVariant: createToneMap(theme.palettes.neutralVariant),
      error: createToneMap(theme.palettes.error),
    };
    
    // Compile the final theme object
    return {
      sourceColor: hexFromArgb(sourceColor),
      lightTheme,
      darkTheme, 
      palettes,
      customColors: [],
      timestamp: new Date().toISOString(),
      meta: {
        imageUrl: typeof source === 'string' ? source : 'custom-color',
        generatedWith: "@material/material-color-utilities",
      }
    };
  } catch (error) {
    console.error('Error generating theme:', error);
    return defaultColorScheme;
  }
};

/**
 * Converts an RGB color to an ARGB integer
 * @param {number} r - Red (0-255)
 * @param {number} g - Green (0-255)
 * @param {number} b - Blue (0-255)
 * @returns {number} - ARGB integer
 */
export const rgbToArgb = (r, g, b) => argbFromRgb(r, g, b);

/**
 * Converts an ARGB integer to a hex color string
 * @param {number} argb - ARGB integer
 * @returns {string} - Hex color string (e.g., "#FF0000")
 */
export const argbToHex = (argb) => hexFromArgb(argb);

// Add CommonJS exports for environments that don't support ES modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    extractColorFromImage,
    generateMaterialYouTheme,
    rgbToArgb,
    argbToHex,
    defaultColorScheme,
  };
}
