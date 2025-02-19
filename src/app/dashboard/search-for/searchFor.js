
"use client";

import { useEffect, useRef, useState, useContext } from "react";
import { Box, Image, Text, Button, VStack } from "@chakra-ui/react";
import { ImageContext } from "@/contexts/ImageContext";

// ✅ Correctly Load Fabric.js Dynamically for Next.js (Client Side)
const loadFabric = async () => {
  const fabricModule = await import("fabric");
  return fabricModule.default || fabricModule.fabric; // ✅ Use `.default` for Fabric v6+
};

export default function SearchFor() {
  const { selectedImage } = useContext(ImageContext);
  const canvasRef = useRef(null);
  const [fabricCanvas, setFabricCanvas] = useState(null);

  useEffect(() => {
    let canvasInstance;

    // ✅ Load Fabric.js properly inside `useEffect`
    loadFabric()
      .then((fabric) => {
        if (!canvasRef.current || fabricCanvas) return; // Prevent duplicate init

        console.log("🎨 Initializing Fabric.js Canvas...");
        canvasInstance = new fabric.Canvas(canvasRef.current, {
          backgroundColor: "transparent",
          width: 400,
          height: 400,
        });

        setFabricCanvas(canvasInstance);

        // ✅ Load Image into Fabric.js Canvas
        if (selectedImage) {
          fabric.Image.fromURL(selectedImage, (img) => {
            img.set({
              left: 0,
              top: 0,
              scaleX: 400 / img.width,
              scaleY: 400 / img.height,
            });
            canvasInstance.add(img);
            canvasInstance.renderAll();
          });
        }
      })
      .catch((error) => {
        console.error("❌ Error loading Fabric.js:", error);
      });

    return () => {
      if (canvasInstance) {
        canvasInstance.dispose();
      }
    };
  }, [selectedImage]);

  // ✅ Enable Lasso Mode (Free Drawing)
  const enableLassoMode = () => {
    if (!fabricCanvas) {
      console.warn("⚠️ Fabric.js canvas not initialized yet!");
      return;
    }

    console.log("✏️ Enabling Lasso Mode...");
    fabricCanvas.isDrawingMode = true;
    fabricCanvas.freeDrawingBrush = new fabric.PencilBrush(fabricCanvas);
    fabricCanvas.freeDrawingBrush.color = "red";
    fabricCanvas.freeDrawingBrush.width = 2;
    console.log("✅ Lasso Mode Activated!");
  };

  return (
    <VStack spacing={4} align="center">
      <Text fontSize="lg" fontWeight="bold">Search for...</Text>

      {selectedImage ? (
        <Image
          src={selectedImage}
          alt="Selected"
          boxSize="200px"
          borderRadius="md"
          cursor="pointer"
          onClick={enableLassoMode} // ✅ Enables lasso when clicked
        />
      ) : (
        <Text>No image selected</Text>
      )}

      {/* ✅ Fabric.js Canvas (for drawing on the image) */}
      <canvas ref={canvasRef}></canvas>

      {/* ✅ Buttons for Future Development */}
      <Button colorScheme="blue">Manual Mask</Button>
      <Button colorScheme="blue">Isolate Subject</Button>
      <Button colorScheme="blue">Create Search Object</Button>
      <Button colorScheme="blue">Add to Object Family</Button>
    </VStack>
  );
}
