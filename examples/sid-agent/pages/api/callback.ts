import {NextApiRequest, NextApiResponse} from 'next'
import axios, {AxiosError} from 'axios'
import {getEnvVar, getTokenEndpoint} from "@/utils";
export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    try {
        const data = {
            grant_type: 'authorization_code',
            client_id: getEnvVar('SID_CLIENT_ID'),
            client_secret: getEnvVar('SID_CLIENT_SECRET'),
            code: req.query.code,
            redirect_uri: getEnvVar('SID_REDIRECT_URL')
        };
        if(!data.code) {
            res.redirect('/');
            return;
        }
        console.log('Endpoint: ' + getTokenEndpoint());
        console.log('Request Body:' + JSON.stringify(data));
        const response = await axios.post(getTokenEndpoint(), data);
        const {access_token, refresh_token, scope, expires_in, token_type} = response.data;
        //CAUTION: DO NOT UNDER ANY CIRCUMSTANCES RETURN THE REFRESH TOKEN TO THE CLIENT APPLICATION
        //THIS IS A SECURITY RISK AND ONLY DONE HERE FOR DEMONSTRATION PURPOSES
        //INSTEAD YOU SHOULD SAVE THE REFRESH TOKEN TO A DATABASE
        res.setHeader('Set-Cookie', `refreshToken=${refresh_token}; Path=/;`);
        res.redirect('/');
        return;
    } catch (error) {
        console.log("The Error:" + JSON.stringify(error));
        if (axios.isAxiosError(error)) {
            const serverError = error as AxiosError;
            if (serverError && serverError.response) {
                res.status(500).json({error: serverError.response.data});
                return;
            } else {
                res.status(500).json({error: 'Something went wrong. (Axios Error)'});
                return;
            }
        } else {
            // unknown error
            res.status(500).json({error: 'Something went wrong. (Unknown Error)'});
            return;
        }
    }
}