import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { address } = req.query;

    if (!address || typeof address !== 'string') {
        return res.status(400).json({ error: 'Invalid address' });
    }

    try {
        const response = await axios.get(`https://api.etherscan.io/api`, {
            params: {
                module: 'account',
                action: 'txlist',
                address: address,
                startblock: 0,
                endblock: 99999999,
                sort: 'asc',
                apikey: process.env.ETHERSCAN_API_KEY
            }
        });

        const history = response.data.result;

        res.status(200).json({ transactions: history });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch transaction history' });
    }
}