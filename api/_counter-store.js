const COUNTER_KEY = process.env.COUNTER_KEY || "hussein_fans_count";

function hasRedisConfig() {
  return Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
}

function assertRedisConfig() {
  if (!hasRedisConfig()) {
    throw new Error("Missing Redis config. Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN in Vercel.");
  }
}

async function redisCommand(parts) {
  assertRedisConfig();
  const baseUrl = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  const endpoint = `${baseUrl}/${parts.map((item) => encodeURIComponent(String(item))).join("/")}`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const data = await response.json();
  if (!response.ok || data.error) {
    throw new Error(data.error || "Redis request failed");
  }

  return data.result;
}

async function getCount() {
  const value = await redisCommand(["GET", COUNTER_KEY]);
  return Number.parseInt(value || "0", 10) || 0;
}

async function incrementCount() {
  const value = await redisCommand(["INCR", COUNTER_KEY]);
  return Number.parseInt(value || "0", 10) || 0;
}

module.exports = {
  getCount,
  incrementCount,
  hasRedisConfig
};