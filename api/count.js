const { getCount, hasRedisConfig } = require("./_counter-store");

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  try {
    const count = await getCount();
    res.status(200).json({
      count,
      storage: "redis",
      configured: hasRedisConfig()
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to read counter.", error: String(error) });
  }
};