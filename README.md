# HEAL SDK (heal-sdk-ankit)

Integrate self-healing capabilities directly into your Node.js application.

## Installation
```bash
npm install heal-sdk-ankit
```

## Usage

```typescript
import express from 'express';
import { createHealMiddleware } from '@heal/sdk';

const app = express();

// Enable HEAL middleware globally or for specific routes
app.use(createHealMiddleware({
    serviceName: 'order-service',
    redisUrl: 'redis://localhost:6379'
}));

app.get('/api/orders', (req, res) => {
    res.json({ orders: [] });
});

app.listen(3000);
```

## How it works
The SDK connects to your central Redis instance used by the HEAL Platform. It:
1.  **Intercepts Responses**: Automatically records latency and error rates to Redis.
2.  **Honors Circuit Breakers**: If the HEAL Platform detects an issue and opens a circuit for your service, the SDK will automatically block requests and serve fallbacks at the edge (inside your app).
3.  **Low Latency**: All checks are performed against Redis with optimized data structures.
