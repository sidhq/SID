import {NextApiRequest, NextApiResponse} from 'next';
import axios, {AxiosError} from 'axios';
import {
    getEnvVar,
    getTokenEndpoint
} from "@/utils/";
import {autoGPTAgent} from "@/utils/agent";
import {SidTool} from "@/utils/sidTool"; // Import axios and AxiosError


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Make sure this function only handles POST requests
    if (req.method !== 'GET') {
        res.status(405).end(); // Method Not Allowed
        return;
    }
    // Extract the query and limit from the data
    const {query, refreshToken} = req.query;

    if (!refreshToken) {
        // Send the response
        res.status(200).json({error: "Not Connected to SID"});
        return;
    }
    console.log("query=" + query);
    // Check if query and limit are defined
    if (typeof query !== 'string') {
        res.status(400).end(); // Bad Request
        return;
    }

    try {
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.flushHeaders();

        // Exchange the refresh token for an access token
        const tokenData = {
            grant_type: 'refresh_token',
            client_id: getEnvVar('SID_CLIENT_ID'),
            client_secret: getEnvVar('SID_CLIENT_SECRET'),
            refresh_token: refreshToken,
            redirect_uri: getEnvVar('SID_REDIRECT_URL'),
        };
        const tokenResponse = await axios.post(getTokenEndpoint(), tokenData);

        const {access_token} = tokenResponse.data;

        const sidTool = new SidTool(access_token);
        //await autoGPTAgent([query], sidTool);

        console.log('hfkdsjhfs');
        res.write(`data: ${JSON.stringify({ answer: 'results1', rawData: 'response.data1' })}\n\n`);
        // Send the second JSON response
        res.write(`data: ${JSON.stringify({ answer: 'results2', rawData: 'response.data2' })}\n\n`);
        // Send the third JSON response and close the connection
        res.write(`data: ${JSON.stringify({ answer: 'results3', rawData: 'response.data3' })}\n\n`);
        res.end();
        // Send the response
        //res.status(200).json({answer: 'results', rawData: 'response.data'});
        return;
    } catch (error) {
        // Handle error
        console.log("Error: " + JSON.stringify(error));
        if (axios.isAxiosError(error)) {
            const serverError = error as AxiosError;
            if (serverError && serverError.response) {
                res.status(500).json({error: serverError.response.data});
                return;
            } else {
                res.status(500).json({error: 'Something went wrong'});
                return;
            }
        } else {
            // unknown error
            res.status(500).json({error: 'Something went wrong'});
            return;
        }
    }
}
