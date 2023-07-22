import {Tool} from "langchain/tools";
import {getAPIEndpoint} from "@/utils/index";
import axios from "axios";


export class SidTool extends Tool {

    private readonly accessToken: string;

    //add constructor
    constructor(accessToken: string) {
        super();
        this.accessToken = accessToken;
    }

    protected async _call(arg: string): Promise<string> {
        const externalEndpoint = getAPIEndpoint();
        const axiosData = {
            query: arg,
            limit: 5
        }
        const axiosConfig = {
            headers: {
                'Authorization': `Bearer ${this.accessToken}`
            }
        };
        const response = await axios.post(externalEndpoint, axiosData, axiosConfig);
        console.log("Response: " + JSON.stringify(response.data));
        return JSON.stringify(response.data.results);
    }

    description: string = 'This tool allows to find personal information about the user. It acts as a search engine that searches through the user\'s files.';
    name: string = 'SIDSearch';

}