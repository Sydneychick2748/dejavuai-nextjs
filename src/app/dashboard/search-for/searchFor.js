// "use client";

// import { useContext } from "react";
// import { ImageContext } from "@/contexts/ImageContext";
// import { Box, Image, Text, Button } from "@chakra-ui/react";
// import { segmentImage } from "@/services/segmentAnything";


// export default function SearchFor() {
//   const { selectedImage } = useContext(ImageContext);

//   return (
//     <Box>
//       <Text fontSize="lg" fontWeight="bold" mb={2}>Search for...</Text>
      
//       <Box
//         border="2px solid blue"
//         p={2}
//         borderRadius="md"
//         textAlign="center"
//         bg="gray.50"
//       >
//         {selectedImage ? (
//           <Image src={selectedImage} alt="Selected" boxSize="200px" borderRadius="md" />
//         ) : (
//           <Text>No image selected</Text>
//         )}
//       </Box>

//       <Button mt={2} colorScheme="blue">Manual Mask</Button>
//       <Button mt={2} colorScheme="blue">Isolate Subject</Button>
//       <Button mt={2} colorScheme="blue">Create Search Object</Button>
//       <Button mt={2} colorScheme="blue">Add to Object Family</Button>
//     </Box>
//   );
// }


//  this is working code for the image to be sent and retured with no segement anything 
// "use client";
// import { useState } from "react";

// export default function SearchFor() {
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [response, setResponse] = useState("");
//   const [imageUrl, setImageUrl] = useState("");

//   const handleFileChange = (event) => {
//     const file = event.target.files[0];
//     setSelectedFile(file);
//     console.log("🚀 Selected file:", file);
//   };

//   const handleUpload = async () => {
//     if (!selectedFile) {
//       alert("Please select an image first!");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("file", selectedFile);

//     try {
//       console.log("🚀 Sending image to FastAPI...");
//       const res = await fetch("http://127.0.0.1:8000/upload-image", {
//         method: "POST",
//         body: formData,
//       });

//       if (!res.ok) {
//         throw new Error(`Upload failed with status: ${res.status}`);
//       }

//       const data = await res.json();
//       console.log("✅ Response from FastAPI:", data);
//       setResponse(data.message);

//       if (data.filename) {
//         // Construct the image URL
//         const imageUrl = `http://127.0.0.1:8000/get-image/${encodeURIComponent(data.filename)}`;
//         console.log(`📢 Attempting to fetch image from: ${imageUrl}`);

//         // Verify the URL is accessible
//         const imageRes = await fetch(imageUrl, {
//           method: "GET",
//           headers: {
//             "Accept": "image/*",
//           },
//         });

//         if (imageRes.ok) {
//           console.log("✅ Image successfully retrieved!");
//           setImageUrl(imageUrl);
//         } else {
//           console.error("❌ Error fetching the uploaded image:", imageRes.statusText);
//           setResponse(`Error fetching image: ${imageRes.statusText}`);
//         }
//       }
//     } catch (error) {
//       console.error("❌ Error:", error);
//       setResponse(`Error: ${error.message}`);
//     }
//   };

//   return (
//     <div>
//       <h1 style={{color: "black"}}>Upload an Image</h1>
//       <input style={{color: "black"}}type="file" accept="image/*" onChange={handleFileChange} />
//       {selectedFile && <p>Selected file: {selectedFile.name}</p>}
//       <button onClick={handleUpload}style={{color: "black"}}>Upload to FastAPI</button>
//       {response && <p>FastAPI Response: {response}</p>}
//       {imageUrl && (
//         <img
//           src={imageUrl}
//           alt="Uploaded Image"
//           style={{ maxWidth: "200px", marginTop: "10px" }}
//           onError={(e) => console.error("❌ Image failed to load:", e)}
//         />
//       )}
//     </div>
//   );
// }
// "use client";
// import { useState } from "react";

// export default function SearchFor() {
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [response, setResponse] = useState("");
//   const [imageUrl, setImageUrl] = useState("");

//   const handleFileChange = (event) => {
//     const file = event.target.files[0];
//     setSelectedFile(file);
//     console.log("🚀 Selected file:", file);
//   };

//   const handleUpload = async () => {
//     if (!selectedFile) {
//       alert("Please select an image first!");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("file", selectedFile);

//     try {
//       console.log("🚀 Sending image to FastAPI for processing...");
//       const res = await fetch("http://127.0.0.1:8000/process-image", {
//         method: "POST",
//         body: formData,
//       });

//       if (!res.ok) {
//         throw new Error(`Upload failed with status: ${res.status}`);
//       }

//       const data = await res.json();
//       console.log("✅ Response from FastAPI:", data);
//       setResponse(data.message);

//       if (data.filename) {
//         const imageUrl = `http://127.0.0.1:8000/get-image/${encodeURIComponent(data.filename)}`;
//         console.log(`📢 Attempting to fetch processed image from: ${imageUrl}`);

//         const imageRes = await fetch(imageUrl, {
//           method: "GET",
//           headers: { "Accept": "image/*" },
//         });

//         if (imageRes.ok) {
//           console.log("✅ Processed image successfully retrieved!");
//           setImageUrl(imageUrl);
//         } else {
//           console.error("❌ Error fetching the processed image:", imageRes.statusText);
//           setResponse(`Error fetching image: ${imageRes.statusText}`);
//         }
//       }
//     } catch (error) {
//       console.error("❌ Error:", error);
//       setResponse(`Error: ${error.message}`);
//     }
//   };

//   return (
//     <div>
//       <h1 style={{ color: "black" }}>Upload an Image</h1>
//       <input type="file" accept="image/*" onChange={handleFileChange} style={{ color: "black" }} />
//       {selectedFile && <p>Selected file: {selectedFile.name}</p>}
//       <button onClick={handleUpload} style={{ color: "black" }}>
//         Upload and Process Image
//       </button>
//       {response && <p>FastAPI Response: {response}</p>}
//       {imageUrl && (
//         <img
//           src={imageUrl}
//           alt="Processed Image"
//           style={{ maxWidth: "200px", marginTop: "10px" }}
//           onError={(e) => console.error("❌ Image failed to load:", e)}
//         />
//       )}
//     </div>
//   );
// }
"use client";
import { useState } from "react";

export default function SearchFor() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [response, setResponse] = useState("");
  const [originalImageUrl, setOriginalImageUrl] = useState("");
  const [processedImageUrl, setProcessedImageUrl] = useState("");

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    // Create a preview URL for the original image.
    const previewUrl = URL.createObjectURL(file);
    setOriginalImageUrl(previewUrl);
    console.log("🚀 Selected file:", file);
  };

  const handleIsolateSubject = async () => {
    if (!selectedFile) {
      alert("Please select an image first!");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      console.log("🚀 Sending image to FastAPI for processing...");
      const res = await fetch("http://127.0.0.1:8000/process-image", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`Upload failed with status: ${res.status}`);
      }

      const data = await res.json();
      console.log("✅ Response from FastAPI:", data);
      setResponse(data.message);

      if (data.filename) {
        const procUrl = `http://127.0.0.1:8000/get-image/${encodeURIComponent(data.filename)}`;
        console.log(`📢 Processed image URL: ${procUrl}`);

        const imageRes = await fetch(procUrl, {
          method: "GET",
          headers: { "Accept": "image/*" },
        });

        if (imageRes.ok) {
          console.log("✅ Processed image successfully retrieved!");
          setProcessedImageUrl(procUrl);
        } else {
          console.error("❌ Error fetching the processed image:", imageRes.statusText);
          setResponse(`Error fetching image: ${imageRes.statusText}`);
        }
      }
    } catch (error) {
      console.error("❌ Error:", error);
      setResponse(`Error: ${error.message}`);
    }
  };

  return (
    <div>
      <h1 style={{ color: "black" }}>Upload an Image</h1>
      <input type="file" accept="image/*" onChange={handleFileChange} style={{ color: "black" }} />
      {selectedFile && (
        <div>
          <p>Selected file: {selectedFile.name}</p>
          <h2>Original Image:</h2>
          <img src={originalImageUrl} alt="Original" style={{ maxWidth: "200px", marginTop: "10px" }} />
        </div>
      )}
      <button onClick={handleIsolateSubject} style={{ color: "black", marginTop: "10px" }}>
        Isolate Subject
      </button>
      {response && <p>Response: {response}</p>}
      {processedImageUrl && (
        <div>
          <h2>Processed Image:</h2>
          <img
            src={processedImageUrl}
            alt="Processed"
            style={{ maxWidth: "200px", marginTop: "10px" }}
            onError={(e) => console.error("❌ Processed image failed to load:", e)}
          />
        </div>
      )}
    </div>
  );
}
