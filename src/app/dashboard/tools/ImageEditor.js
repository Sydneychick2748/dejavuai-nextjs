// "use client";
// import { useEffect, useRef, useState, useContext } from "react";
// import dynamic from "next/dynamic";
// import { Box } from "@chakra-ui/react";
// import { ImageContext } from "@/contexts/ImageContext";

// // ✅ Ensure Fabric.js loads correctly
// const fabricPromise = dynamic(
//   () =>
//     import("fabric").then((mod) => {
//       if (!mod.fabric || !mod.fabric.Canvas) {
//         throw new Error("⚠️ Fabric.js `Canvas` module is missing!");
//       }
//       return mod.fabric;
//     }),
//   { ssr: false }
// );

// export default function ImageEditor() {
//   const canvasRef = useRef(null);
//   const { selectedImage, setFabricCanvas } = useContext(ImageContext); // ✅ Use context
//   const [fabricCanvas, setLocalFabricCanvas] = useState(null);

//   useEffect(() => {
//     async function loadFabric() {
//       try {
//         console.log("🔄 Attempting to load Fabric.js...");
//         const fabric = await fabricPromise;

//         if (!fabric || typeof fabric.Canvas !== "function") {
//           throw new Error("⚠️ Fabric.js not loaded properly! `Canvas` is missing.");
//         }

//         if (!canvasRef.current) {
//           console.warn("⚠️ canvasRef is null. Waiting for DOM...");
//           return;
//         }

//         console.log("🎨 Initializing Fabric.js Canvas...");
//         const newCanvas = new fabric.Canvas(canvasRef.current, {
//           backgroundColor: "#ccc",
//           width: 500,
//           height: 500,
//         });

//         setFabricCanvas(newCanvas); // ✅ Store globally
//         setLocalFabricCanvas(newCanvas); // ✅ Store locally
//         console.log("✅ Fabric.js Canvas initialized!");

//         if (selectedImage) {
//           console.log("🖼️ Loading selected image:", selectedImage);
//           fabric.Image.fromURL(selectedImage, (img) => {
//             if (!newCanvas) {
//               console.error("🚨 Fabric.js canvas is null when adding image!");
//               return;
//             }
//             img.set({ left: 50, top: 50, scaleX: 0.5, scaleY: 0.5 });
//             newCanvas.add(img);
//             newCanvas.renderAll();
//             console.log("✅ Image added to canvas!");
//           }, { crossOrigin: "anonymous" });
//         }
//       } catch (error) {
//         console.error("❌ Error loading Fabric.js:", error.message);
//       }
//     }

//     loadFabric();

//     return () => {
//       if (fabricCanvas) {
//         console.log("🧹 Cleaning up Fabric.js canvas...");
//         fabricCanvas.dispose();
//       }
//     };
//   }, [selectedImage]);

//   return <Box><canvas ref={canvasRef}></canvas></Box>;
// }
