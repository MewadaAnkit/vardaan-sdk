import { Request, Response, NextFunction } from 'express';
import { Redis } from 'ioredis';

export interface HealOptions {
    redisUrl?: string;
    serviceName: string;
}

export function createHealMiddleware(options: HealOptions) {
    const redis = new Redis(options.redisUrl || 'redis://localhost:6379');
    const service = options.serviceName;

    return async (req: Request, res: Response, next: NextFunction) => {
        const endpoint = `${service}:${req.path}`;
        const start = Date.now();

        // 1. Check Circuit Breaker State in Redis
        const activeAction = await redis.get(`active_healing:${endpoint}`);
        if (activeAction) {
            const action = JSON.parse(activeAction);
            if (action.state === 'OPEN') {
                // Return fallback if available, or 503
                const fallback = await redis.get(`fallback:${endpoint}`);
                if (fallback) {
                    return res.status(200).json(JSON.parse(fallback));
                }
                return res.status(503).json({
                    error: 'Circuit Breaker Open',
                    healStatus: 'PROTECTED'
                });
            }
        }

        // 2. Intercept Response to record metrics
        const originalSend = res.send;
        res.send = function (body: any) {
            const latency = Date.now() - start;
            const statusCode = res.statusCode;

            // Log metric to Redis for the global HEAL engine to see
            const metric = {
                endpoint: req.path,
                method: req.method,
                statusCode,
                latency,
                timestamp: Date.now()
            };

            // Non-blocking write to Redis
            redis.zadd(`metrics:${endpoint}`, metric.timestamp, JSON.stringify(metric))
                .catch(err => console.error('[HEAL-SDK] Failed to record metric', err));

            return originalSend.apply(res, [body]);
        };

        next();
    };
}
