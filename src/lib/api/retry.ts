import { ApiError } from "./client";

interface RetryOptions {
  retries?: number;
  delayMs?: number;
  factor?: number;
  signal?: AbortSignal;
  retryOn?: (error: unknown) => boolean;
}

const wait = (ms: number, signal?: AbortSignal) =>
  new Promise<void>((resolve, reject) => {
    const timer = setTimeout(resolve, ms);
    if (signal) {
      const onAbort = () => {
        clearTimeout(timer);
        reject(new DOMException("Aborted", "AbortError"));
      };
      if (signal.aborted) {
        onAbort();
        return;
      }
      signal.addEventListener("abort", onAbort, { once: true });
    }
  });

const defaultRetryPredicate = (error: unknown) =>
  (error instanceof ApiError && error.status >= 500) ||
  (error instanceof TypeError && error.message.includes("Failed to fetch"));

export async function withRetry<T>(
  fn: () => Promise<T>,
  { retries = 2, delayMs = 400, factor = 2, signal, retryOn = defaultRetryPredicate }: RetryOptions = {},
): Promise<T> {
  let attempt = 0;

  while (true) {
    if (signal?.aborted) {
      throw new DOMException("Aborted", "AbortError");
    }
    try {
      return await fn();
    } catch (error) {
      attempt += 1;
      const shouldRetry = attempt <= retries && retryOn(error);
      if (!shouldRetry) throw error;
      const delay = delayMs * Math.pow(factor, attempt - 1);
      await wait(delay, signal);
    }
  }
}
