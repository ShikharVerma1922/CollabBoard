import rateLimit from "express-rate-limit";
import { RATE_LIMITS } from "../constants.js";

// Rate limiter for comments - 5 per minute
export const commentRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: RATE_LIMITS.COMMENTS_PER_MINUTE,
  message: "Too many comments sent from this IP, please slow down.",
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter for messages - 10 per 10 seconds
export const messageRateLimiter = rateLimit({
  windowMs: 10 * 1000, // 10 seconds
  max: RATE_LIMITS.MESSAGES_PER_10_SECONDS,
  message: "You're sending messages too quickly. Please slow down.",
  standardHeaders: true,
  legacyHeaders: false,
});
