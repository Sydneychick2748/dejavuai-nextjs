import { useEffect, useState } from "react";

export default function TestConnection() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/")
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch((err) => console.error("Error fetching API:", err));
  }, []);

  return (
    <div>
      <h1>FastAPI + Next.js Integration Test</h1>
      <p>API Response: {message}</p>
    </div>
  );
}
