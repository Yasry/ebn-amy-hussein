const { incrementCount, hasRedisConfig } = require("../_counter-store");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  try {
    const count = await incrementCount();
    res.status(200).json({
      count,
      storage: "redis",
      configured: hasRedisConfig()
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to increment counter.", error: String(error) });
  }
};