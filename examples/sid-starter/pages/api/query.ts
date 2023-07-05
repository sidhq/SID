import { NextApiRequest, NextApiResponse } from 'next';
import axios, { AxiosError } from 'axios';
import {getEnvVar} from "@/utils/"; // Import axios and AxiosError


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Make sure this function only handles POST requests
    console.log('BEGIN QUERY RESULTS');
    if (req.method !== 'POST') {
        res.status(405).end(); // Method Not Allowed
        return;
    }

    // Extract the query and limit from the data
    const { query, limit, refreshToken } = req.body;

    // Check if query and limit are defined
    if (typeof query !== 'string' || typeof limit !== 'number') {
        res.status(400).end(); // Bad Request
        return;
    }

    try {
        // Exchange the refresh token for an access token
        const tokenData = {
            grant_type: 'refresh_token',
            client_id: getEnvVar('SID_CLIENT_ID'),
            client_secret: getEnvVar('SID_CLIENT_SECRET'),
            refresh_token: refreshToken,
            redirect_uri: getEnvVar('SID_REDIRECT_URL'),
        };
        console.log("Token Data: " + JSON.stringify(tokenData));
        const tokenResponse = await axios.post(getEnvVar('SID_AUTH_ENDPOINT') || '', tokenData);

        const { access_token } = tokenResponse.data;
        console.log("Access Token: " + access_token);

        const externalEndpoint = getEnvVar('SID_API_ENDPOINT');
        const axiosData ={
            query: query,
            limit: limit
        }
        const axiosConfig = {
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        };
        // Make a request to the api endpoint
        console.log("External Endpoint: " + externalEndpoint);
        console.log("Axios Data: " + JSON.stringify(axiosData));
        console.log("Axios Config: " + JSON.stringify(axiosConfig));
        const response = await axios.post(externalEndpoint, axiosData, axiosConfig);

        // Extract the data from the API response
        const results = response.data;
        console.log("Results: " + JSON.stringify(results));
        // Send the response
        res.status(200).json(results);
    } catch (error) {
        // Handle error
        if (axios.isAxiosError(error)) {
            const serverError = error as AxiosError;
            if (serverError && serverError.response) {
                res.status(500).json({error: serverError.response.data});
            } else {
                res.status(500).json({error: 'Something went wrong'});
            }
        } else {
            // unknown error
            res.status(500).json({error: 'Something went wrong'});
        }
    }
}
