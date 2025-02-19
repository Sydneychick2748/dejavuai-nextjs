
"use client";

import { Flex, Box } from "@chakra-ui/react";
import SearchFor from "./search-for/searchFor";
import SearchParams from "./search-params/searchParams";
import UploadFiles from "./upload-files/UploadFiles";
import ImageEditor from "./tools/ImageEditor"; // ✅ Correct

import { ImageProvider } from "@/contexts/ImageContext"; // ✅ Import Image Context
import "./dashboard.css";
import "../globals.css";

export default function Dashboard() {
  return (
    <ImageProvider> {/* ✅ Wrap in ImageProvider */}
      <VStack spacing={6} align="start" w="full" p={4}>
        <UploadFiles />
        <SearchFor />
        <ImageEditor /> {/* ✅ Add ImageEditor to show Fabric.js */}
        <SearchParams />
      </VStack>
    </ImageProvider>
  );
}
