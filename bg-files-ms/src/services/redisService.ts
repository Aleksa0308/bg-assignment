import Redis from 'ioredis';
import { REDIS } from '../config/config';

class RedisService{
    private redis!: Redis;
    initialize(){
        // initialize redis connection

        this.redis = new Redis({
            host: REDIS.REDIS_HOST,
            port: REDIS.REDIS_PORT
        })
    }

    async set(key: string, value: any, expirationSeconds: number): Promise<void> {
        await this.redis.set(key, JSON.stringify(value), "EX", expirationSeconds);
    }

    async get(key: string): Promise<any | null> {
        const result = await this.redis.get(key);
        if (result) {
            return JSON.parse(result);
        }
        return null;
    }
}

export default new RedisService();