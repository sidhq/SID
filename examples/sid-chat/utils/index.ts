import {ChatOpenAI} from "langchain/chat_models/openai";
import {AIChatMessage, BaseChatMessage, HumanChatMessage, SystemChatMessage} from "langchain/schema";
import {encodingForModel} from "js-tiktoken";

export interface APIResponse {
    results: {
        score: number;
        text: string;
        name: string;
        kind: string;
    }[];
}

export interface APIResponseExampleEndpoint {
    result: {
        text: string;
    };
}

type Message = {
    isAIMessage: boolean;
    content: string;
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

export async function getContext(retrieved: APIResponse, messageHistory: Message[]) {
    const model = new ChatOpenAI({
        modelName: "gpt-3.5-turbo",
        temperature: 0,
    });

    let stringifiedContext = '';
    const encoding = encodingForModel("gpt-4");
    let totalTokens = 0;
    let tokenThreshold = 2500;
    for (let i = 0; i < retrieved.results.length; i++) {
        const addition = `${i + 1}. ${retrieved.results[i].text} \n`;
        const tokensInAddition = encoding.encode(addition).length;
        console.log(`Tokens in addition: ${tokensInAddition}\n`);
        console.log(`Adding to context: ${addition}\n`);
        if (totalTokens + tokensInAddition < tokenThreshold) {
            totalTokens += tokensInAddition;
            stringifiedContext += addition;
            console.log('Added this chunk, to context..\n\n');
        } else {
            console.log('Skipping this chunk, too large..\n\n');
        }
    }
    console.log('Total tokens final: ' + totalTokens);
    console.log('stringifiedContext: ' + stringifiedContext);
    let openAIMessageHistory = [];
    openAIMessageHistory.push(new SystemChatMessage('You are a helpful AI assistant that has access to a highly ' +
        'advanced search engine that helps you find files that contain information about the user. ' +
        'Your answers are concise, informative and use the context provided by the file search. ' +
        'If you are unable to find the answer, answer the user that you did not find any information ' +
        'about the query in the files that are accessible to you. ' +
        'But do always share anything that you find and might be relevant to the user query.' +
        'If the question does not concern content but instead refers to metadata, for example ' +
        '"What is the last google drive file I viewed?"' +
        'Answer to the user that you only have answer to contents, but not metadata.'));

    for (let i = 0; i < messageHistory.length - 1; i++) {
        if (messageHistory[i].isAIMessage) {
            openAIMessageHistory.push(new AIChatMessage(messageHistory[i].content));
        } else {
            openAIMessageHistory.push(new HumanChatMessage(messageHistory[i].content));
        }
    }
    openAIMessageHistory.push(new SystemChatMessage(`The following results might help you answer the next user query:\n ${stringifiedContext}`));
    openAIMessageHistory.push(new HumanChatMessage(messageHistory[messageHistory.length - 1].content));
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
    return new URL('/v1/users/me/query', getEnvVar('SID_API_ENDPOINT')).toString()
}

export const getExampleEndpoint = (): string => {
    return new URL('/v1/users/me/example', getEnvVar('SID_API_ENDPOINT')).toString()
}

export const getCookie = (cookieName: string): string | undefined => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${cookieName}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
}