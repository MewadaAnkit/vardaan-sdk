import { Request, Response, NextFunction } from 'express';
export interface HealOptions {
    redisUrl?: string;
    serviceName: string;
}
export declare function createHealMiddleware(options: HealOptions): (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
