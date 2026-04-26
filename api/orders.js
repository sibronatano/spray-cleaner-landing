import { Redis } from '@upstash/redis';

export default async function handler(req, res) {
    const { password } = req.query;

    if (password !== 'admin1234') {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        let orders = [];
        const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
        const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

        if (url && token) {
            const redis = new Redis({
                url: url,
                token: token,
            });
            orders = await redis.lrange('spray_orders', 0, -1);
        }

        return res.status(200).json({ success: true, orders });
    } catch (error) {
        console.error('Error fetching orders:', error);
        return res.status(500).json({ error: 'Failed to fetch orders' });
    }
}
