
"use client";

import { useEffect, useRef, useState, useContext } from "react";
import { Box, Text, Button, VStack } from "@chakra-ui/react";
import { ImageContext } from "@/contexts/ImageContext";

// Load Fabric.js dynamically (Client Side)
const loadFabric = async () => {
  const fabricModule = await import("fabric");
  return fabricModule;
};

export default function SearchFor() {
  const { selectedImage } = useContext(ImageContext);
  const canvasRef = useRef(null);
  const [fabricCanvas, setFabricCanvas] = useState(null);

  useEffect(() => {
    let canvasInstance;

    loadFabric()
      .then((fabric) => {
        if (!canvasRef.current || fabricCanvas) return; // Prevents duplicate initialization

        console.log("🎨 Initializing Fabric.js Canvas...");
        canvasInstance = new fabric.Canvas(canvasRef.current, {
          backgroundColor: "transparent",
          width: 400,
          height: 400,
        });

        setFabricCanvas(canvasInstance);

        // Load Image into Fabric.js Canvas
        if (selectedImage) {
          fabric.Image.fromURL(selectedImage)
            .then((img) => {
              img.set({
                left: 0,
                top: 0,
                scaleX: 400 / img.width,
                scaleY: 400 / img.height,
              });
              canvasInstance.add(img);
              canvasInstance.renderAll();
              console.log("✅ Image added to canvas!");
            })
            .catch((error) => console.error("❌ Error loading image:", error));
        }
      })
      .catch((error) => console.error("❌ Error loading Fabric.js:", error));

    return () => {
      if (canvasInstance) {
        console.log("🧹 Cleaning up Fabric.js canvas...");
        canvasInstance.dispose();
      }
    };
  }, [selectedImage]);

  // Enable Lasso Mode (Free Drawing) and crop the drawn area
  const enableLassoAndCrop = async () => {
    console.log("Manual Mask button clicked");
    if (!fabricCanvas) {
      console.warn("⚠️ Fabric.js canvas not initialized yet!");
      return;
    }

    const fabric = await loadFabric();
    console.log("✏️ Enabling Lasso Mode...");
    fabricCanvas.isDrawingMode = true;
    fabricCanvas.freeDrawingBrush = new fabric.PencilBrush(fabricCanvas);
    fabricCanvas.freeDrawingBrush.color = "red";
    fabricCanvas.freeDrawingBrush.width = 2;
    console.log("✅ Lasso Mode Activated!");

    fabricCanvas.on('mouse:up', async () => {
      console.log("🖼️ Mouse up detected, cropping...");
      const drawnPaths = fabricCanvas.getObjects('path');
      if (drawnPaths.length === 0) {
        console.warn("⚠️ No drawing found to crop!");
        return;
      }

      const drawingPath = drawnPaths[0]; // Assuming there's only one drawing path
      const boundingBox = drawingPath.getBoundingRect();

      const croppedCanvas = document.createElement('canvas');
      const croppedContext = croppedCanvas.getContext('2d');
      croppedCanvas.width = boundingBox.width;
      croppedCanvas.height = boundingBox.height;

      // Copy the cropped portion of the original canvas to the new canvas
      croppedContext.drawImage(
        canvasRef.current,
        boundingBox.left,
        boundingBox.top,
        boundingBox.width,
        boundingBox.height,
        0,
        0,
        boundingBox.width,
        boundingBox.height
      );

      // Save the cropped image as a new image
      const croppedImage = croppedCanvas.toDataURL("image/png");
      const imgElement = document.createElement("img");
      imgElement.src = croppedImage;
      document.body.appendChild(imgElement); // Append cropped image to body (for demonstration)

      // Reset the drawing mode and clear the canvas
      fabricCanvas.isDrawingMode = false;
      fabricCanvas.clear();
    });
  };

  return (
    <VStack spacing={4} align="center">
      <Text fontSize="lg" fontWeight="bold">Search for...</Text>

      {selectedImage ? (
        <canvas
          ref={canvasRef}
          style={{ border: "1px solid black", width: "400px", height: "400px" }}
        ></canvas>
      ) : (
        <Text>No image selected</Text>
      )}

      {/* Enable Lasso Mode and Crop Drawing on the same button click */}
      <Button colorScheme="blue" onClick={enableLassoAndCrop}>Manual Mask</Button>
      <Button colorScheme="blue">Isolate Subject</Button>
      <Button colorScheme="blue">Create Search Object</Button>
      <Button colorScheme="blue">Add to Object Family</Button>
    </VStack>
  );
}
