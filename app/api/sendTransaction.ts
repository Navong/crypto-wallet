import type { NextApiRequest, NextApiResponse } from 'next';
import { ethers } from 'ethers';
import { JsonRpcProvider, formatEther, parseEther } from 'ethers';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { privateKey, to, value } = req.body;
    if (!privateKey || !to || !value) {
        return res.status(400).json({ error: 'Missing parameters' });
    }

    try {
        const provider = new JsonRpcProvider('https://bsc-dataseed.binance.org/');
        const wallet = new ethers.Wallet(privateKey);
        const signer = wallet.connect(provider);

        const tx = await signer.sendTransaction({
            to,
            value: parseEther(value),
        });

        res.status(200).json({ txHash: tx.hash });
    } catch (error) {
        res.status(500).json({ error: 'Transaction failed', details: (error as Error).message });
    }
}
