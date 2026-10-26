import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const url = process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN;

if (!url || !token) {
    throw new Error("Upstash Redis environment variables are missing.");
}

const redis = new Redis({ url, token });
export const bookingRateLimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(3, "10 m"),
    analytics: true,
    prefix: "ugo:booking",
});
export const adminLoginRateLimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, "20 m"),
    analytics: true,
    prefix: "ugo:admin-login",
});