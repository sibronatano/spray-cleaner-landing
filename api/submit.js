import { Redis } from '@upstash/redis';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const order = { id: Date.now(), ...req.body, date: new Date().toISOString() };

        if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
            const redis = new Redis({
                url: process.env.UPSTASH_REDIS_REST_URL,
                token: process.env.UPSTASH_REDIS_REST_TOKEN,
            });
            await redis.lpush('spray_orders', order);
        }

        return res.status(200).json({ success: true, message: 'Order submitted successfully' });
    } catch (error) {
        console.error('Error submitting order:', error);
        return res.status(500).json({ error: 'Failed to submit order' });
    }
}
