import { NextApiRequest, NextApiResponse } from 'next';
import axios, { AxiosError } from 'axios';
import {
    getAPIEndpoint,
    getChatCompletion,
    getChatCompletionRefreshTokenMissing,
    getContext,
    getEnvVar,
    getTokenEndpoint
} from "@/utils/"; // Import axios and AxiosError


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Make sure this function only handles POST requests
    if (req.method !== 'POST') {
        res.status(405).end(); // Method Not Allowed
        return;
    }

    // Extract the query and limit from the data
    const { messageHistory, query, limit, refreshToken, sidEnabled } = req.body;

    if (!sidEnabled) {
        const results = await getChatCompletion(messageHistory);
        console.log("Results: " + JSON.stringify(results));
        // Send the response
        res.status(200).json({answer : results});
        return;
    } else if(!refreshToken) {
        const results = await getChatCompletionRefreshTokenMissing(messageHistory);
        console.log("Results: " + JSON.stringify(results));
        // Send the response
        res.status(200).json({answer : results, rawData: {error: "Please click on the 'Continue with SID' button."}});
        return;
    }

    console.log("messageHistory=" + JSON.stringify(messageHistory));
    console.log("query=" + query);
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
        const tokenResponse = await axios.post(getTokenEndpoint(), tokenData);

        const { access_token } = tokenResponse.data;

        const externalEndpoint = getAPIEndpoint();
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
        console.log("Making Axios Request...");
        const response = await axios.post(externalEndpoint, axiosData, axiosConfig);
        console.log("Axios Response: " + JSON.stringify(response.data));
        // Extract the data from the API response
        const results = await getContext(response.data, messageHistory);
        console.log("Results: " + JSON.stringify(results));
        // Send the response
        res.status(200).json({answer : results, rawData: response.data});
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