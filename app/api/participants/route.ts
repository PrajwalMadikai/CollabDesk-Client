import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { room } = req.query;

  if (!room){
    return res.status(400).json({ error: "Missing room parameter" });
  }

  try {
    const apiKey = process.env.NEXT_PUBLIC_LIVEKIT_API_KEY;
    const apiSecret = process.env.NEXT_PUBLIC_LIVEKIT_API_SECRET;
    const wsUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL;

    if (!apiKey || !apiSecret || !wsUrl) {
      return res.status(500).json({ error: "Server misconfigured" });
    }

    const response = await axios.get(`${wsUrl}/room/${room}/participants`, {
      headers: {
        Authorization: `Bearer ${apiSecret}`,
      },
    });

    res.status(200).json({ participants: response.data });
  } catch (error) {
    console.error("Error fetching participants:", error);
    if (axios.isAxiosError(error)) {
      return res.status(500).json({ error: error.message });
    }
    res.status(500).json({ error: "Failed to fetch participants" });
  }
}