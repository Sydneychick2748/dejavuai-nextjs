// "use client";
// import { useState, useContext } from "react";
// import { Text, Button, VStack, Image, Spinner } from "@chakra-ui/react";
// import { ImageContext } from "@/contexts/ImageContext";
// import { removeBackground } from "@imgly/background-removal"; // :white_check_mark: Correct import
// export default function SearchFor() {
//   const { selectedImage } = useContext(ImageContext);
//   const [processedImage, setProcessedImage] = useState(null);
//   const [isLoading, setIsLoading] = useState(false); // :white_check_mark: Add loading state
//   // :white_check_mark: Background Removal Function with Faster Processing
//   const handleRemoveBackground = async () => {
//     console.log(":rocket: Isolate Subject button clicked!");
//     if (!selectedImage) {
//       console.warn(":warning: No image selected!");
//       return;
//     }
//     try {
//       setIsLoading(true); // :white_check_mark: Show loading state
//       console.log(":frame_with_picture: Fetching image data from:", selectedImage);
//       // **:small_blue_diamond: Convert Image URL to Blob for Processing**
//       const response = await fetch(selectedImage);
//       const imageBlob = await response.blob();
//       console.log(":camera_with_flash: Image converted to Blob. Blob size:", imageBlob.size);
//       // :white_check_mark: Send image to Imgly for background removal
//       console.log(":hourglass_flowing_sand: Sending image to Imgly for processing...");
//       const resultBlob = await removeBackground(imageBlob);
//       console.log(":white_check_mark: Background removed successfully!");
//       // :white_check_mark: Convert Blob to URL and set the state
//       const url = URL.createObjectURL(resultBlob);
//       setProcessedImage(url);
//     } catch (error) {
//       console.error(":x: Background removal failed:", error);
//     } finally {
//       setIsLoading(false); // :white_check_mark: Hide loading state
//     }
//   };
//   return (
//     <VStack spacing={4} align="center">
//       <Text fontSize="xl" fontWeight="bold">Search for...</Text>
//       {/* :white_check_mark: Show either the processed image or the original */}
//       {processedImage ? (
//         <Image src={processedImage} alt="Processed Image" boxSize="600px" objectFit="contain" />
//       ) : selectedImage ? (
//         <Image src={selectedImage} alt="Uploaded Image" boxSize="600px" objectFit="contain" />
//       ) : (
//         <Text>No image selected</Text>
//       )}
//       {/* :white_check_mark: Bigger Loading Spinner */}
//       {isLoading && (
//         <VStack>
//           <Spinner size="xl" thickness="6px" speed="0.8s" color="blue.500" />
//           <Text fontSize="lg" color="gray.600">Processing Image...</Text>
//         </VStack>
//       )}
//       {/* :white_check_mark: Button is ALWAYS VISIBLE */}
//       <Button colorScheme="blue" onClick={handleRemoveBackground} isDisabled={isLoading}>
//         {isLoading ? "Processing..." : "Isolate Subject"}
//       </Button>
//     </VStack>
//   );
// }







"use client";
import { useEffect, useRef, useState, useContext } from "react";
import { Text, Button, VStack, Spinner } from "@chakra-ui/react";
import { ImageContext } from "@/contexts/ImageContext";
import { removeBackground } from "@imgly/background-removal";
// :white_check_mark: Load Fabric.js dynamically (unchanged)
const loadFabric = async () => {
  const fabricModule = await import("fabric");
  return fabricModule;
};
export default function SearchFor() {
  const { selectedImage } = useContext(ImageContext);
  const canvasRef = useRef(null);
  const [fabricCanvas, setFabricCanvas] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  // :white_check_mark: Load Fabric.js & Add Image to Canvas (unchanged)
  useEffect(() => {
    let canvasInstance;
    loadFabric()
      .then((fabric) => {
        if (!canvasRef.current || fabricCanvas) return;
        console.log(":art: Initializing Fabric.js Canvas...");
        canvasInstance = new fabric.Canvas(canvasRef.current, {
          backgroundColor: "transparent",
          width: 600,
          height: 600,
          selection: false,
        });
        setFabricCanvas(canvasInstance);
        if (selectedImage) {
          fabric.Image.fromURL(selectedImage)
            .then((img) => {
              img.set({
                left: 0,
                top: 0,
                scaleX: 600 / img.width,
                scaleY: 600 / img.height,
                selectable: false,
                evented: false,
              });
              canvasInstance.add(img);
              canvasInstance.renderAll();
              console.log(":white_check_mark: Image added to canvas!");
            })
            .catch((error) => console.error(":x: Error loading image:", error));
        }
      })
      .catch((error) => console.error(":x: Error loading Fabric.js:", error));
    return () => {
      if (canvasInstance) {
        console.log(":broom: Cleaning up Fabric.js canvas...");
        canvasInstance.dispose();
      }
    };
  }, [selectedImage]);
  // :white_check_mark: Enable Lasso Mode (Free Drawing) (unchanged)
  const enableLassoMode = async () => {
    console.log(":pencil2: Manual Mask button clicked");
    if (!fabricCanvas) {
      console.warn(":warning: Fabric.js canvas not initialized yet!");
      return;
    }
    const fabric = await loadFabric();
    console.log(":white_check_mark: Enabling Lasso Mode...");
    fabricCanvas.isDrawingMode = true;
    fabricCanvas.freeDrawingBrush = new fabric.PencilBrush(fabricCanvas);
    fabricCanvas.freeDrawingBrush.color = "red";
    fabricCanvas.freeDrawingBrush.width = 2;
  };
  // :white_check_mark: Revised Background Removal Function
  const handleRemoveBackground = async () => {
    console.log(":rocket: Isolate Subject button clicked!");
    if (!selectedImage) {
      console.warn(":warning: No image selected!");
      return;
    }
    try {
      setIsLoading(true);
      console.log(":frame_with_picture: Fetching image data from:", selectedImage);
      const response = await fetch(selectedImage, { mode: "cors" });
      if (!response.ok) throw new Error(`Fetch failed: ${response.statusText}`);
      const imageBlob = await response.blob();
      console.log(":camera_with_flash: Image converted to Blob. Blob size:", imageBlob.size);
      if (imageBlob.size === 0) {
        throw new Error("Image blob is empty!");
      }
      console.log(":hourglass_flowing_sand: Sending image to Imgly for processing...");
      const resultBlob = await removeBackground(imageBlob, {
        output: { format: "image/png" }, // Explicitly request PNG to preserve transparency
      });
      console.log(":white_check_mark: Background removal completed. Result size:", resultBlob.size);
      if (resultBlob.size === 0) {
        throw new Error("Processed image blob is empty!");
      }
      const url = URL.createObjectURL(resultBlob);
      // :white_check_mark: Load processed image into Fabric.js canvas
      if (fabricCanvas) {
        fabricCanvas.clear(); // Clear existing content
        const fabric = await loadFabric();
        fabric.Image.fromURL(url, (img) => {
          if (!img.width || !img.height) {
            console.warn(":warning: Processed image is invalid, reverting to original!");
            fabric.Image.fromURL(selectedImage, (originalImg) => {
              originalImg.set({
                left: 0,
                top: 0,
                scaleX: 600 / originalImg.width,
                scaleY: 600 / originalImg.height,
                selectable: false,
                evented: false,
              });
              fabricCanvas.add(originalImg);
              fabricCanvas.renderAll();
            });
            return;
          }
          img.set({
            left: 0,
            top: 0,
            scaleX: 600 / img.width,
            scaleY: 600 / img.height,
            selectable: false,
            evented: false,
          });
          fabricCanvas.add(img);
          fabricCanvas.renderAll();
          console.log(":white_check_mark: Processed image loaded into canvas!");
        });
      }
    } catch (error) {
      console.error(":x: Background removal failed:", error);
      if (fabricCanvas) {
        fabricCanvas.clear();
        const fabric = await loadFabric();
        fabric.Image.fromURL(selectedImage, (img) => {
          img.set({
            left: 0,
            top: 0,
            scaleX: 600 / img.width,
            scaleY: 600 / img.height,
            selectable: false,
            evented: false,
          });
          fabricCanvas.add(img);
          fabricCanvas.renderAll();
          console.log(":white_check_mark: Reverted to original image due to error!");
        });
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <VStack spacing={4} align="center">
      <Text fontSize="xl" fontWeight="bold">Search for...</Text>
      {/* :white_check_mark: Always render the canvas if there’s an image */}
      {selectedImage ? (
        <canvas
          ref={canvasRef}
          style={{ border: "1px solid black", width: "600px", height: "600px" }}
        ></canvas>
      ) : (
        <Text>No image selected</Text>
      )}
      {/* :white_check_mark: Bigger Loading Spinner */}
      {isLoading && (
        <VStack>
          <Spinner size="xl" thickness="6px" speed="0.8s" color="blue.500" />
          <Text fontSize="lg" color="gray.600">Processing Image...</Text>
        </VStack>
      )}
      {/* :white_check_mark: Buttons are ALWAYS VISIBLE */}
      <Button colorScheme="blue" onClick={enableLassoMode}>
        Manual Mask
      </Button>
      <Button colorScheme="blue" onClick={handleRemoveBackground} isDisabled={isLoading}>
        {isLoading ? "Processing..." : "Isolate Subject"}
      </Button>
    </VStack>
  );
}