"use client";

import { useState, useRef } from "react";
import {
  generateMaterialYouTheme,
  defaultColorScheme,
} from "../../utils/colourgenerator";
import Image from "next/image";

// Material You UI Components
const FloatingActionButton = ({ color, onClick, children }) => (
  <button
    onClick={onClick}
    className="rounded-full p-4 shadow-lg flex items-center justify-center text-white"
    style={{ backgroundColor: color }}
  >
    {children}
  </button>
);

const AppBar = ({ color, textColor, title }) => (
  <div
    className="w-full p-4 shadow-md"
    style={{ backgroundColor: color, color: textColor }}
  >
    <h2 className="text-xl font-medium">{title}</h2>
  </div>
);

const Card = ({ surface, onSurface, children }) => (
  <div
    className="rounded-lg shadow-md p-4 my-2"
    style={{ backgroundColor: surface, color: onSurface }}
  >
    {children}
  </div>
);

const Button = ({ color, textColor, onClick, children }) => (
  <button
    onClick={onClick}
    className="px-4 py-2 rounded-md shadow-sm"
    style={{ backgroundColor: color, color: textColor }}
  >
    {children}
  </button>
);

const ColorSwatch = ({ color, name }) => (
  <div className="flex flex-col items-center mb-2">
    <div
      className="w-12 h-12 rounded-full mb-1 border border-gray-200"
      style={{ backgroundColor: color }}
    ></div>
    <span className="text-xs">{name}</span>
    <span className="text-xs">{color}</span>
  </div>
);

export default function MaterialYouDemo() {
  const [colorScheme, setColorScheme] = useState(defaultColorScheme);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const fileInputRef = useRef(null);

  const currentTheme = isDarkMode
    ? colorScheme.darkTheme
    : colorScheme.lightTheme;

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsLoading(true);

    try {
      // Create a URL for the uploaded file
      const imageUrl = URL.createObjectURL(file);
      setUploadedImage(imageUrl);

      // Generate the color scheme
      const newColorScheme = await generateMaterialYouTheme(imageUrl);
      console.log("New color scheme:", newColorScheme);

      setColorScheme(newColorScheme);
    } catch (error) {
      console.error("Error processing image:", error);
      alert("Failed to process the image. Please try another one.");
    } finally {
      setIsLoading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div
      className="h-dvh flex flex-col"
      style={{
        backgroundColor: currentTheme.background,
        color: currentTheme.onBackground,
      }}
    >
      <AppBar
        color={currentTheme.primary}
        textColor={currentTheme.onPrimary}
        title="Material You Color Demo"
      />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-4">
            Material You Theme Generator
          </h1>
          <p className="mb-4">
            Upload an image to extract a custom Material You color scheme
          </p>

          <div className="flex justify-center gap-4 mb-6">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            <Button
              color={currentTheme.primaryContainer}
              textColor={currentTheme.onPrimaryContainer}
              onClick={triggerFileInput}
            >
              Upload Image
            </Button>
            <Button
              color={currentTheme.secondaryContainer}
              textColor={currentTheme.onSecondaryContainer}
              onClick={toggleTheme}
            >
              {isDarkMode ? "Switch to Light" : "Switch to Dark"}
            </Button>
          </div>

          {isLoading && (
            <div className="flex justify-center my-4">
              <div
                className="w-8 h-8 rounded-full animate-spin"
                style={{
                  borderWidth: "4px",
                  borderStyle: "solid",
                  borderColor: `${currentTheme.primary} transparent transparent transparent`,
                }}
              ></div>
            </div>
          )}

          {uploadedImage && (
            <div className="my-6 flex justify-center">
              <div className="relative w-64 h-64 rounded-lg overflow-hidden">
                <Image
                  src={uploadedImage}
                  alt="Uploaded image"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          )}
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Color Palette</h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
            <ColorSwatch color={currentTheme.primary} name="Primary" />
            <ColorSwatch color={currentTheme.onPrimary} name="On Primary" />
            <ColorSwatch
              color={currentTheme.primaryContainer}
              name="Primary Container"
            />
            <ColorSwatch
              color={currentTheme.onPrimaryContainer}
              name="On Primary Container"
            />
            <ColorSwatch color={currentTheme.secondary} name="Secondary" />
            <ColorSwatch color={currentTheme.onSecondary} name="On Secondary" />
            <ColorSwatch
              color={currentTheme.secondaryContainer}
              name="Secondary Container"
            />
            <ColorSwatch
              color={currentTheme.onSecondaryContainer}
              name="On Secondary Container"
            />
            <ColorSwatch color={currentTheme.tertiary} name="Tertiary" />
            <ColorSwatch color={currentTheme.error} name="Error" />
            <ColorSwatch color={currentTheme.background} name="Background" />
            <ColorSwatch color={currentTheme.surface} name="Surface" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-2xl font-bold mb-4">UI Components</h2>

            <Card
              surface={currentTheme.surface}
              onSurface={currentTheme.onSurface}
            >
              <h3 className="text-xl font-semibold mb-2">Card Title</h3>
              <p className="mb-4">
                This is a card styled with your Material You theme colors.
              </p>
              <div className="flex gap-2">
                <Button
                  color={currentTheme.primary}
                  textColor={currentTheme.onPrimary}
                  onClick={() => {}}
                >
                  Primary
                </Button>
                <Button
                  color={currentTheme.secondary}
                  textColor={currentTheme.onSecondary}
                  onClick={() => {}}
                >
                  Secondary
                </Button>
              </div>
            </Card>

            <div className="my-4">
              <label
                className="block mb-2 font-medium"
                style={{ color: currentTheme.onBackground }}
              >
                Text Input
              </label>
              <input
                type="text"
                placeholder="Input with theme colors"
                className="w-full px-3 py-2 rounded-md border"
                style={{
                  backgroundColor: currentTheme.surfaceVariant,
                  color: currentTheme.onSurfaceVariant,
                  borderColor: currentTheme.outline,
                }}
              />
            </div>

            <div className="my-4">
              <label
                className="block mb-2 font-medium"
                style={{ color: currentTheme.onBackground }}
              >
                Progress Bar
              </label>
              <div
                className="w-full h-2 rounded-full overflow-hidden"
                style={{ backgroundColor: currentTheme.surfaceVariant }}
              >
                <div
                  className="h-full"
                  style={{
                    width: "70%",
                    backgroundColor: currentTheme.primary,
                  }}
                ></div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">Typography & Elements</h2>

            <div
              className="p-4 rounded-lg mb-4"
              style={{ backgroundColor: currentTheme.surfaceVariant }}
            >
              <h3
                className="text-2xl font-bold mb-2"
                style={{ color: currentTheme.primary }}
              >
                Heading with Primary Color
              </h3>
              <p
                className="mb-2"
                style={{ color: currentTheme.onSurfaceVariant }}
              >
                This paragraph uses the onSurfaceVariant color to ensure proper
                contrast on the surfaceVariant background.
              </p>
              <p
                className="font-medium"
                style={{ color: currentTheme.secondary }}
              >
                This text uses the secondary color for emphasis.
              </p>
            </div>

            <div className="flex gap-4 my-4">
              <div
                className="w-16 h-16 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: currentTheme.primaryContainer }}
              >
                <span style={{ color: currentTheme.onPrimaryContainer }}>
                  Icon
                </span>
              </div>
              <div
                className="w-16 h-16 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: currentTheme.secondaryContainer }}
              >
                <span style={{ color: currentTheme.onSecondaryContainer }}>
                  Icon
                </span>
              </div>
              <div
                className="w-16 h-16 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: currentTheme.tertiaryContainer }}
              >
                <span style={{ color: currentTheme.onTertiaryContainer }}>
                  Icon
                </span>
              </div>
            </div>

            <div
              className="p-4 rounded-lg border"
              style={{
                borderColor: currentTheme.outline,
                backgroundColor: currentTheme.surface,
              }}
            >
              <h4
                className="font-semibold mb-2"
                style={{ color: currentTheme.onSurface }}
              >
                Alert Message
              </h4>
              <div
                className="p-3 rounded-md mb-2"
                style={{
                  backgroundColor: currentTheme.error,
                  color: currentTheme.onError,
                }}
              >
                Error alert message
              </div>
              <div
                className="p-3 rounded-md"
                style={{
                  backgroundColor: currentTheme.primaryContainer,
                  color: currentTheme.onPrimaryContainer,
                }}
              >
                Info alert message
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-6 right-6">
        <FloatingActionButton
          color={currentTheme.primary}
          onClick={triggerFileInput}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            ></path>
          </svg>
        </FloatingActionButton>
      </div>
    </div>
  );
}
