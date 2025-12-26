# HEAL SDK: Integration & Real-World Guide

This guide explains how to use `@heal/sdk` to make your Node.js applications self-healing with zero complexity.

---

## 🌍 Real-World Scenario: The "Payment Gateway" Problem

Imagine you run an E-commerce site. Your `Order Service` calls an external `Payment Gateway`. 

### The Problem
If the Payment Gateway becomes slow (latency > 5s), your `Order Service` threads will hang, waiting for responses. Eventually, your memory fills up, and your entire site crashes for **ALL** users, even those just browsing products.

### The HEAL Solution
By using the HEAL SDK, your `Order Service` will:
1.  **Monitor**: Automatically track every payment request's success and speed.
2.  **Protect**: If failures spike, HEAL will "Open the Circuit".
3.  **Fallback**: Instead of hanging, your app immediately tells the user: *"Payments are currently slow. We've saved your cart and will notify you when it's ready!"* (Better than a crash!).

---

## 🛠️ Step-by-Step Integration

### 1. Install the SDK
```bash
npm install @heal/sdk
```

### 2. Plug it into Express
Add the middleware at the start of your app. This connects your app to the global HEAL dashboard (via Redis).

```typescript
import express from 'express';
import { createHealMiddleware } from '@heal/sdk';

const app = express();

// Global Protection
app.use(createHealMiddleware({
    serviceName: 'checkout-service',
    redisUrl: 'redis://your-production-redis:6379'
}));
```

### 3. Handle a Fallback (Optional but Recommended)
HEAL can serve a "static" response when things go wrong so your app doesn't have to logic its way out of a crash.

```typescript
// No changes needed to your route! 
// HEAL will intercept this and return the Fallback JSON from Redis 
// if the Circuit Breaker is ON.
app.post('/api/pay', async (req, res) => {
    const result = await externalPaymentAPI(req.body);
    res.json(result);
});
```

---

## 📈 Why Developers Love It (The "Why")

| Before HEAL | After HEAL |
| :--- | :--- |
| **Silent Failures**: We don't know why the app is slow until we check logs. | **Instant Visibility**: HEAL alerts you immediately when error rates spike. |
| **Manual Coding**: Every developer writes their own retry logic (often with bugs). | **Standardized Reliability**: One line of code for production-grade retries/logic. |
| **The "Thundering Herd"**: When a service recovers, 10,000 requests hit it at once and crash it again. | **Smart Recovery**: HEAL slowly lets traffic back in (Half-Open state) to ensure it stays healthy. |

---

## 🏁 Summary
The HEAL SDK turns your "fragile" app into a **"Resilient"** one. It’s like having an automated SRE (Site Reliability Engineer) inside your code, watching over every request.
