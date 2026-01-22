/**
 * Simple client-side rate limiter using a token bucket algorithm
 */

interface RateLimiterOptions {
  maxTokens: number; // Maximum number of tokens
  refillRate: number; // Tokens to add per second
}

export class RateLimiter {
  private tokens: number;
  private maxTokens: number;
  private refillRate: number;
  private lastRefill: number;

  constructor(options: RateLimiterOptions) {
    this.maxTokens = options.maxTokens;
    this.refillRate = options.refillRate;
    this.tokens = options.maxTokens;
    this.lastRefill = Date.now();
  }

  private refill(): void {
    const now = Date.now();
    const timePassed = (now - this.lastRefill) / 1000; // seconds
    const tokensToAdd = timePassed * this.refillRate;
    this.tokens = Math.min(this.maxTokens, this.tokens + tokensToAdd);
    this.lastRefill = now;
  }

  /**
   * Try to consume a token
   * @returns true if token was consumed, false if rate limited
   */
  tryConsume(): boolean {
    this.refill();
    if (this.tokens >= 1) {
      this.tokens -= 1;
      return true;
    }
    return false;
  }

  /**
   * Wait until a token is available, then consume it
   */
  async waitForToken(): Promise<void> {
    this.refill();
    if (this.tokens >= 1) {
      this.tokens -= 1;
      return;
    }

    // Calculate wait time
    const tokensNeeded = 1 - this.tokens;
    const waitTime = (tokensNeeded / this.refillRate) * 1000;

    await new Promise((resolve) => setTimeout(resolve, waitTime));
    this.refill();
    this.tokens -= 1;
  }

  /**
   * Get time until next token is available (in ms)
   */
  getTimeUntilAvailable(): number {
    this.refill();
    if (this.tokens >= 1) return 0;
    const tokensNeeded = 1 - this.tokens;
    return (tokensNeeded / this.refillRate) * 1000;
  }

  /**
   * Get current token count
   */
  getTokens(): number {
    this.refill();
    return this.tokens;
  }
}

// Global rate limiter for API calls
// Allows 10 requests immediately, then 2 per second
export const apiRateLimiter = new RateLimiter({
  maxTokens: 10,
  refillRate: 2,
});
