import type {NextApiRequest, NextApiResponse} from 'next'
import axios from 'axios'
import {getEnvVar, getTokenEndpoint} from "@/utils";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    // Extract refreshToken from request body
    const {refreshToken} = req.body;

    if(!refreshToken) {
        // return error response
        res.status(401).json({error: 'Refresh token missing'});
        return;
    }

    const tokenData = {
        grant_type: 'refresh_token',
        client_id: getEnvVar('SID_CLIENT_ID'),
        client_secret: getEnvVar('SID_CLIENT_SECRET'),
        refresh_token: refreshToken,
        redirect_uri: getEnvVar('SID_REDIRECT_URL'),
    };

    console.log("Token Data: " + JSON.stringify(tokenData));

    try {
        const tokenResponse = await axios.post(getTokenEndpoint(), tokenData);

        const {access_token} = tokenResponse.data;

        // return response with access token
        res.status(200).json({accessToken: access_token});
        return;
    } catch (error ) {
        // return error response
        res.status(500).json({error: 'Internal Server Error'});
        return;
    }
}
