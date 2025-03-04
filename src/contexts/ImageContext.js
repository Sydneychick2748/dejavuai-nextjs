"use client";
import { createContext, useState } from "react";

export const ImageContext = createContext();

export const ImageProvider = ({ children }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [fabricCanvas, setFabricCanvas] = useState(null); // ✅ Store Fabric.js instance

  return (
    <ImageContext.Provider value={{ selectedImage, setSelectedImage, fabricCanvas, setFabricCanvas }}>
      {children}
    </ImageContext.Provider>
  );
};
