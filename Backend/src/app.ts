import express from "express";
import cors from "cors";
import { createClient } from "redis";
import useGraph from "./service/graph.ai.service.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ── REDIS CACHE SYSTEM ────────────────────────────────────────────────────────
const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";
const redisClient = createClient({ url: REDIS_URL });

let isRedisConnected = false;
const inMemoryCache = new Map<string, any>();

redisClient.on("error", (err) => {
  console.warn("Redis client warning:", err.message || err);
  isRedisConnected = false;
});

// Try to connect to Redis. Fallback to in-memory cache on failure.
redisClient.connect()
  .then(() => {
    console.log("Connected to Redis server successfully.");
    isRedisConnected = true;
  })
  .catch((err) => {
    console.warn("Redis connection failed. Falling back to local in-memory cache.");
    isRedisConnected = false;
  });

/**
 * Cache getter helper
 */
async function getCachedBattle(key: string): Promise<any | null> {
  const cacheKey = `battle:cache:${key}`;
  if (isRedisConnected) {
    try {
      const cached = await redisClient.get(cacheKey);
      if (cached) {
        console.log("[Cache Hit - Redis]:", key);
        return JSON.parse(cached);
      }
    } catch (err) {
      console.warn("Failed to get cache from Redis:", err);
    }
  }
  
  if (inMemoryCache.has(cacheKey)) {
    console.log("[Cache Hit - Local Memory]:", key);
    return inMemoryCache.get(cacheKey);
  }
  
  return null;
}

/**
 * Cache setter helper
 */
async function setCachedBattle(key: string, value: any): Promise<void> {
  const cacheKey = `battle:cache:${key}`;
  const serialized = JSON.stringify(value);
  
  if (isRedisConnected) {
    try {
      // Cache with 1 hour TTL (3600 seconds)
      await redisClient.setEx(cacheKey, 3600, serialized);
      console.log("[Cache Set - Redis]:", key);
      return;
    } catch (err) {
      console.warn("Failed to set cache in Redis:", err);
    }
  }

  inMemoryCache.set(cacheKey, value);
  console.log("[Cache Set - Local Memory]:", key);
}

// ── ENDPOINTS ──────────────────────────────────────────────────────────────────

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    cache: isRedisConnected ? "redis" : "in-memory",
    timestamp: new Date().toISOString(),
  });
});

// Main battle endpoint
app.post("/use-graph", async (req, res) => {
  const { question } = req.body;

  if (!question || typeof question !== "string" || !question.trim()) {
    return res.status(400).json({ error: "Missing or invalid 'question' field." });
  }

  const normalizedQuestion = question.trim().toLowerCase();

  try {
    // 1. Check cache first
    const cachedResult = await getCachedBattle(normalizedQuestion);
    if (cachedResult) {
      return res.status(200).json(cachedResult);
    }

    // 2. Invoke battle graph
    const result = await useGraph(question.trim());

    // 3. Store result in cache
    await setCachedBattle(normalizedQuestion, result);

    return res.status(200).json(result);
  } catch (err: any) {
    console.error("Battle execution failed:", err);
    return res.status(500).json({
      error: "AI battle execution failed.",
      details: err?.message || String(err),
    });
  }
});

export default app;
