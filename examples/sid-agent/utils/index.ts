import {ChatOpenAI} from "langchain/chat_models/openai";
import {AIChatMessage, BaseChatMessage, HumanChatMessage, SystemChatMessage} from "langchain/schema";

export interface APIResponse {
    results: string[];
}

type Message = {
    isAIMessage: boolean;
    content: string;
};

type Result = {
    score: number;
    title: string;
    kind: string;
    text: string;
};

export async function getChatCompletionRefreshTokenMissing(messageHistory: Message[]) {
    return 'Unfortunately I do not have access to SID yet. Please click on "Continue with SID" to connect your SID account first.';
}

export async function getChatCompletion(messageHistory: Message[]) {
    const model = new ChatOpenAI({
        modelName: "gpt-3.5-turbo",
        temperature: 0,
    });

    let openAIMessageHistory = [];
    openAIMessageHistory.push(new SystemChatMessage('You are a helpful AI assistant that tries its best to help the user.'));
    messageHistory.forEach((message) => {
        if (message.isAIMessage) {
            openAIMessageHistory.push(new AIChatMessage(message.content));
        } else {
            openAIMessageHistory.push(new HumanChatMessage(message.content));
        }
    });
    const res: BaseChatMessage = await model.call(openAIMessageHistory);
    return res.text;
}
//make global variable called acces token:

function formatResultsToMarkdown(results: Result[]): string {
    if (results.length === 0) {
        return "- no additional context provided\n";
    }

    return results.map(result => {
        const scoreAsPercentage = (result.score * 100).toFixed(2);
        return `- **${result.title} (Confidence: ${scoreAsPercentage}%):** "${result.text}"`;
    }).join('\n');
}

export async function getContext(retrieved: APIResponse, messageHistory: Message[]) {
    const model = new ChatOpenAI({
        modelName: "gpt-3.5-turbo",
        temperature: 0,
    });

    const stringifiedContext = formatResultsToMarkdown(retrieved.results as Result[]);
    
    let openAIMessageHistory = [];
    openAIMessageHistory.push(new SystemChatMessage('You are an expert writer and editor AI. You hold yourself to high journalistic standards and never invent or misrepresent information. You have been given the following writing task.' +
        'If the question does not concern content but instead refers to metadata, for example ' +
        '"What is the last google drive file I viewed?"' +
        'Answer to the user that you only have answer to contents, but not metadata.'));

    for (let i = 0; i < messageHistory.length-1; i++) {
        if (messageHistory[i].isAIMessage) {
            openAIMessageHistory.push(new AIChatMessage(messageHistory[i].content));
        } else {
            openAIMessageHistory.push(new HumanChatMessage(messageHistory[i].content));
        }
    }
    openAIMessageHistory.push(new SystemChatMessage(`Instructions: You complete the writing task using the context provided below. Do not say that you do not know or need more information. Be concise and specific. Never repeat yourself. Refrain from using vacuous phrases that do not convey concrete information.\n\nContext:\n${stringifiedContext}\n\nText:\n`));
    openAIMessageHistory.push(new HumanChatMessage(messageHistory[messageHistory.length-1].content));
    const res: BaseChatMessage = await model.call(openAIMessageHistory);
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
