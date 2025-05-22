export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    const response = await fetch("https://api.freepik.com/v1/ai/text-to-image/flux-dev", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-freepik-api-key": process.env.FREEPIK_API_KEY
      },
      body: JSON.stringify({
        prompt,
        aspect_ratio: "widescreen_16_9",
        style: "realistic",
        guidance: 7.5,
        quality: "standard"
      })
    });

    const data = await response.json();

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message || "Something went wrong" });
  }
}
