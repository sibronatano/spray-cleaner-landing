import { Redis } from '@upstash/redis';

export default async function handler(req, res) {
    const { password } = req.query;

    if (password !== 'admin1234') {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        let orders = [];
        if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
            const redis = new Redis({
                url: process.env.UPSTASH_REDIS_REST_URL,
                token: process.env.UPSTASH_REDIS_REST_TOKEN,
            });
            orders = await redis.lrange('spray_orders', 0, -1);
        }

        return res.status(200).json({ success: true, orders });
    } catch (error) {
        console.error('Error fetching orders:', error);
        return res.status(500).json({ error: 'Failed to fetch orders' });
    }
}
