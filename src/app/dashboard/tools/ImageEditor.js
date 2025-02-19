"use client";
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Box, Button, HStack } from "@chakra-ui/react";
import { useContext } from "react";
import { ImageContext } from "@/contexts/ImageContext";

// ✅ FIXED: Ensure we properly extract `fabric.Canvas`
const fabricPromise = dynamic(
  () => import("fabric").then((mod) => {
    console.log("🔍 Fabric Module Loaded:", mod);
    return mod.default ? mod.default : mod; // ✅ Ensures correct reference
  }),
  { ssr: false }
);

export default function ImageEditor() {
  const canvasRef = useRef(null);
  const fabricCanvas = useRef(null);
  const { selectedImage } = useContext(ImageContext);
  const [isFabricLoaded, setIsFabricLoaded] = useState(false);
  const [isLassoMode, setIsLassoMode] = useState(false);

  useEffect(() => {
    console.log("🚀 ImageEditor Mounted");
    console.log("🌎 Is window defined?", typeof window !== "undefined");

    async function loadFabric(retryCount = 0) {
      try {
        console.log(`🔄 Attempting to load Fabric.js... (Attempt: ${retryCount})`);

        const fabric = await fabricPromise;
        console.log("🔍 Fabric module loaded:", fabric);

        if (!fabric || !fabric.Canvas) {
          console.error("⚠️ Fabric.js not loaded properly! `Canvas` is missing.");
          return;
        }

        if (!canvasRef.current) {
          console.warn(`⚠️ canvasRef is null. Retrying in 500ms... (Attempt: ${retryCount})`);
          if (retryCount < 5) {
            setTimeout(() => loadFabric(retryCount + 1), 500);
          } else {
            console.error("🚨 Max retries reached! canvasRef is still null.");
          }
          return;
        }

        console.log("✅ Fabric.js loaded successfully!");

        if (!fabricCanvas.current) {
          console.log("🎨 Initializing Fabric.js Canvas...");
          fabricCanvas.current = new fabric.Canvas(canvasRef.current, {
            backgroundColor: "#ccc",
            width: 500,
            height: 500,
          });

          setIsFabricLoaded(true);
          console.log("✅ Fabric.js Canvas initialized!");
        }

        if (selectedImage) {
          console.log("🖼️ Loading selected image:", selectedImage);
          fabric.Image.fromURL(
            selectedImage,
            (img) => {
              if (!fabricCanvas.current) {
                console.error("🚨 Fabric.js canvas is null when adding image!");
                return;
              }

              img.set({
                left: 50,
                top: 50,
                scaleX: 0.5,
                scaleY: 0.5,
              });

              fabricCanvas.current.add(img);
              fabricCanvas.current.renderAll();
              console.log("✅ Image added to canvas!");
            },
            { crossOrigin: "anonymous" }
          );
        }
      } catch (error) {
        console.error("❌ Error loading Fabric.js:", error.message);
      }
    }

    if (typeof window !== "undefined") {
      loadFabric();
    }

    return () => {
      if (fabricCanvas.current) {
        console.log("🧹 Cleaning up Fabric.js canvas...");
        fabricCanvas.current.dispose();
        fabricCanvas.current = null;
      }
    };
  }, [selectedImage]);

  // Enable Lasso Selection Mode
  const enableLasso = async () => {
    console.log("🖍️ Activating Lasso Select Mode...");
    if (!isFabricLoaded || !fabricCanvas.current) {
      console.warn("⚠️ No canvas found! Lasso mode cannot be enabled.");
      return;
    }

    try {
      const fabric = await fabricPromise;
      console.log("🖌 Fabric object for Lasso Select:", fabric);

      if (!fabric || !fabric.PencilBrush) {
        throw new Error("⚠️ Fabric.js PencilBrush is missing!");
      }

      setIsLassoMode(true);
      fabricCanvas.current.isDrawingMode = true;
      fabricCanvas.current.freeDrawingBrush = new fabric.PencilBrush(fabricCanvas.current);
      fabricCanvas.current.freeDrawingBrush.color = "red";
      fabricCanvas.current.freeDrawingBrush.width = 2;

      console.log("✅ Lasso Select enabled!");
    } catch (error) {
      console.error("❌ Error enabling Lasso mode:", error.message);
    }
  };

  // Disable Lasso Mode
  const disableLasso = () => {
    console.log("🚫 Disabling Lasso Select...");
    if (!isFabricLoaded || !fabricCanvas.current) {
      console.warn("⚠️ No canvas found! Cannot disable lasso.");
      return;
    }

    try {
      fabricCanvas.current.isDrawingMode = false;
      setIsLassoMode(false);
      console.log("✅ Lasso Select disabled!");
    } catch (error) {
      console.error("❌ Error disabling Lasso mode:", error.message);
    }
  };

  // Rotate Image
  const rotateImage = async () => {
    console.log("🔄 Attempting to Rotate Image...");
    if (!isFabricLoaded || !fabricCanvas.current) {
      console.warn("⚠️ No canvas found! Rotation not possible.");
      return;
    }

    try {
      const activeObject = fabricCanvas.current.getActiveObject();
      if (activeObject) {
        console.log("↩️ Rotating active object...");
        activeObject.rotate((activeObject.angle || 0) + 45);
        fabricCanvas.current.renderAll();
        console.log("✅ Image rotated!");
      } else {
        console.warn("⚠️ No object selected for rotation.");
      }
    } catch (error) {
      console.error("❌ Error rotating image:", error.message);
    }
  };

  return (
    <Box>
      <canvas ref={canvasRef}></canvas>
      <HStack mt={4}>
        <Button onClick={enableLasso} colorScheme="blue">
          Lasso Select
        </Button>
        <Button onClick={disableLasso} colorScheme="red">
          Confirm Selection
        </Button>
        <Button onClick={rotateImage} colorScheme="green">
          Rotate
        </Button>
      </HStack>
    </Box>
  );
}
