
export default function handler(req, res) {
    if (req.method === "POST") {
      return res.status(200).json({ message: "API route is working!" });
    } else {
      return res.status(405).json({ error: "Method not allowed" });
    }
  }
  