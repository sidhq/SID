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


async function callSIDApi(accessToken: string, refreshToken: string, query: string, limit: number): Promise<any> {
    async function refreshAccessToken(refreshToken: string): Promise<string> {
        // console.log("Refreshing Access Token...");
        const tokenData = {
            grant_type: 'refresh_token',
            client_id: getEnvVar('SID_CLIENT_ID'),
            client_secret: getEnvVar('SID_CLIENT_SECRET'),
            refresh_token: refreshToken,
            redirect_uri: getEnvVar('SID_REDIRECT_URL'),
        };
        const tokenResponse = await axios.post(getTokenEndpoint(), tokenData);

        const { access_token } = tokenResponse.data;
        return access_token;
    }
    async function callAPI(accessToken: string, query: string, limit: number): Promise<any> {
        const externalEndpoint = getAPIEndpoint();
        const axiosData ={
            query: query,
            limit: limit
        }
        const axiosConfig = {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        };
        const response = await axios.post(externalEndpoint, axiosData, axiosConfig);
        return response.data;
    }
    return await callAPI(accessToken, query, limit).catch(async (error) => {
        if (axios.isAxiosError(error)) {
            const serverError = error as AxiosError;
            if (serverError && serverError.response) {
                const { status } = serverError.response;
                if (status === 401) {
                    // console.log("Access Token Expired. Refreshing...");
                    const newAccessToken = await refreshAccessToken(refreshToken);
                    // console.log("New Access Token: " + newAccessToken);
                    return await callAPI(newAccessToken, query, limit);
                } else {
                    throw error;
                }
            } else {
                throw error;
            }
        } else {
            throw error;
        }
    })
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Make sure this function only handles POST requests
    if (req.method !== 'POST') {
        res.status(405).end(); // Method Not Allowed
        return;
    }

    // Extract the query and limit from the data
    const { messageHistory, query, limit, accessToken, refreshToken, mode } = req.body;

    // console.log("mode=" + mode)
    if (mode == "openai") {
        const results = await getChatCompletion(messageHistory);
        // console.log("Results: " + JSON.stringify(results));
        // Send the response
        res.status(200).json({answer : results});
        return;
    } else if(!refreshToken) {
        const results = await getChatCompletionRefreshTokenMissing(messageHistory);
        // console.log("Results: " + JSON.stringify(results));
        // Send the response
        res.status(200).json({answer : results, rawData: {error: "Please click on the 'Continue with SID' button."}});
        return;
    }

    // console.log("messageHistory=" + JSON.stringify(messageHistory));
    // console.log("query=" + query);
    // Check if query and limit are defined
    if (typeof query !== 'string' || typeof limit !== 'number') {
        res.status(400).end(); // Bad Request
        return;
    }

    try {
        const data = await callSIDApi(accessToken, refreshToken, query, limit);
        // Exchange the refresh token for an access token
        // console.log("Axios Response: " + JSON.stringify(response.data));
        // Extract the data from the API response
        if (mode == "sid-raw") {
            // Send the response
            res.status(200).json({answer : data});
            return;
        }
        const results = await getContext(data, messageHistory);
        // console.log("Results: " + JSON.stringify(results));
        // Send the response
        res.status(200).json({answer : results});
        return;
    } catch (error) {
        // Handle error
        // console.log("Error: " + JSON.stringify(error));
        if (axios.isAxiosError(error)) {
            const serverError = error as AxiosError;
            if (serverError && serverError.response) {
                console.log("Error: " + JSON.stringify(serverError.response.data));
                res.status(500).json({error: serverError.response.data});
                return;
            } else {
                console.log("Error: " + JSON.stringify(error));
                res.status(500).json({error: 'Something went wrong'});
                return;
            }
        } else {
            // unknown error
            console.log("Error");
            res.status(500).json({error: 'Something went wrong'});
            return;
        }
    }
}
