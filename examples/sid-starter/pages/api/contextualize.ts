import {NextApiRequest, NextApiResponse} from 'next';
import {getContext, APIResponse} from '@/utils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const {retrieved, initial_query}: { retrieved: APIResponse, initial_query: string } = req.body;
        try {
            const result = await getContext(retrieved, initial_query);
            res.status(200).json({response: result});
        } catch (error) {
            console.error(error);
            res.status(500).json({error: 'Internal Server Error'});
        }
    } else {
        // If the method is not POST, return an error.
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}