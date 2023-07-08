import {ChatOpenAI} from "langchain/chat_models/openai";
import {AIChatMessage, BaseChatMessage, HumanChatMessage, SystemChatMessage} from "langchain/schema";

export interface APIResponse {
    results: string[];
}

export async function getContext(retrieved: APIResponse, initial_query: string) {
    const model = new ChatOpenAI({
        modelName: "gpt-4-0613",
        temperature: 0,
    });

    let stringified_context = '';

    for (let i = 0; i < retrieved.results.length; i++) {
        stringified_context += `${i + 1}. ${retrieved.results[i]} \n`
    }
    const systemMessage = new SystemChatMessage('You are a helpful AI assistant that can access documents that contain context about a user. Your answers are concise, informative and use the context provided by the document search.')
    const humanMessage = new HumanChatMessage(`${initial_query} \n Document Search:\n ${stringified_context}`)
    const res: BaseChatMessage = await model.call(
        [systemMessage, humanMessage]);
    console.log(systemMessage);
    console.log(humanMessage);
    console.log(res.text);
    return res.text;
}


/**
 * Returns the value of the specified environment variable.
 *
 * @param varName - The name of the environment variable.
 * @returns The value of the environment variable.
 * @throws Error if the environment variable is not set.
 */
export const getEnvVar = (varName: string): string => {
    const value = process.env[varName];
    if (!value) throw new Error(`${varName} environment variable is not set.`);
    return value;
}

export const getTokenEndpoint = (): string => {
    return new URL('/oauth/token', getEnvVar('SID_AUTH_ENDPOINT')).toString()
}

export const getRevokeEndpoint = (): string => {
    return new URL('/oauth/revoke', getEnvVar('SID_AUTH_ENDPOINT')).toString()
}

export const getAPIEndpoint = (): string => {
    return new URL('/api/v1/users/me/data/query', getEnvVar('SID_API_ENDPOINT')).toString()
}

export const getCookie = (cookieName: string): string | undefined => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${cookieName}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
}