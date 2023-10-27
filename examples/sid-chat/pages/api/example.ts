import {NextApiRequest, NextApiResponse} from "next";
import {
    APIResponse,
    APIResponseExampleEndpoint,
    getAPIEndpoint,
    getEnvVar,
    getExampleEndpoint,
    getTokenEndpoint
} from "@/utils";
import axios, {AxiosError} from "axios";

async function callSIDApi(accessToken: string, text: string, responses: number): Promise<APIResponseExampleEndpoint[]> {
    async function callAPI(accessToken: string, text: string): Promise<APIResponseExampleEndpoint> {
        const externalEndpoint = getExampleEndpoint();
        const axiosData = {
            text: text,
        }
        const axiosConfig = {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        };
        const response = await axios.post(externalEndpoint, axiosData, axiosConfig);
        return response.data;
    }

    const promises: Promise<APIResponseExampleEndpoint>[] = [];
    for (let i = 0; i < responses; i++) {
        promises.push(callAPI(accessToken, text));
    }
    try {
        return Promise.all(promises);
    } catch (error) {
        throw error;
    }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Make sure this function only handles POST requests
    if (req.method !== 'POST') {
        res.status(405).end(); // Method Not Allowed
        return;
    }
    const {accessToken, type} = req.body;
    try {

        const response = (await callSIDApi(accessToken, type, 9)).map((r) => r.result.text);
        console.log(response);
        res.status(200).json({answer : response});
    } catch (error) {
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