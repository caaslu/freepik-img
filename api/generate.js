const https = require("https");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  const payload = JSON.stringify({
    prompt,
    aspect_ratio: "widescreen_16_9",
    style: "realistic",
    guidance: 7.5,
    quality: "standard"
  });

  const options = {
    hostname: "api.freepik.com",
    path: "/v1/ai/text-to-image/flux-dev",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-freepik-api-key": process.env.FREEPIK_API_KEY
    }
  };

  const apiReq = https.request(options, (apiRes) => {
    let data = "";

    apiRes.on("data", (chunk) => {
      data += chunk;
    });

    apiRes.on("end", () => {
      try {
        const result = JSON.parse(data);
        res.status(200).json(result);
      } catch (error) {
        res.status(500).json({ error: "Failed to parse API response" });
      }
    });
  });

  apiReq.on("error", (e) => {
    res.status(500).json({ error: e.message });
  });

  apiReq.write(payload);
  apiReq.end();
};
