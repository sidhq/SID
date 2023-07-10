// pages/api/disconnect.ts
import { NextApiRequest, NextApiResponse } from 'next';
import {getEnvVar, getRevokeEndpoint} from "@/utils";
import axios from "axios";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        try {
            // Parse cookies
            const cookies = req.headers.cookie?.split('; ');

            // Get refreshToken
            const refreshToken = cookies?.find(cookie => cookie.startsWith('refreshToken='))?.split('=')[1];

            const data = {
                client_id: getEnvVar('SID_CLIENT_ID'),
                client_secret: getEnvVar('SID_CLIENT_SECRET'),
                token: refreshToken
            };
            console.log('Endpoint: ' + getRevokeEndpoint());
            console.log('Request Body:' + JSON.stringify(data));
            const response = await axios.post(getRevokeEndpoint(), data);

            if (response.status === 200) {
                // Clear the cookie
                res.setHeader('Set-Cookie', 'refreshToken=; Max-Age=0; Path=/; HttpOnly; SameSite=Lax');
                // Send success status
                res.status(200).json({ message: 'Successfully disconnected.' });
            } else {
                // Send error status
                res.status(500).json({ message: 'An error occurred while disconnecting.' });
            }
        } catch (error) {
            console.error(error);
            // Send error status
            res.status(500).json({ message: 'An error occurred while disconnecting.' });
        }
    } else {
        // If not a POST request, send 405 - Method Not Allowed
        res.status(405).json({ message: 'Request method not allowed; POST required.' });
    }
};

export default handler;
