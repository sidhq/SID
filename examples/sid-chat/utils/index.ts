import {ChatOpenAI} from "langchain/chat_models/openai";
import {AIChatMessage, BaseChatMessage, HumanChatMessage, SystemChatMessage} from "langchain/schema";
import {encodingForModel} from "js-tiktoken";
/*import OpenAI from 'openai';
import ChatCompletionMessageParam = OpenAI.ChatCompletionMessageParam;
import {AIMessagePromptTemplate, ChatPromptTemplate, PromptTemplate} from "langchain/prompts";*/

export interface APIResponse {
    results: Result[];
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

type Result = {
    score: number;
    text: string;
    name: string;
    kind: string;
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


/*export async function getLLMScoresLangchain(query: string, results: Result[]) {
//not in use, but working well. Output parsing still missing for a production ready version
    const model = new ChatOpenAI({
        modelName: "gpt-3.5-turbo",
        temperature: 0,
    });
    return await Promise.all(results.map(async (result) => {

        const messageHistory = [
            new SystemChatMessage('Your are an expert judge AI. You are given a query and a text snippet from a document. You have to decide whether the text snippet is relevant to the query.'),
            new HumanChatMessage(`Please judge if the returned text snippet is relevant to the following query: \n"${query}"`),
            new SystemChatMessage(`From the document with the title ${result.name}, the following text snippet is returned to you:\n "${result.text}`),
            new HumanChatMessage('Now explain step by step if you believe the returned text snippet helps to answer the query in 3 sentences.')
        ]
        const res: BaseChatMessage = await model.call(messageHistory);
        messageHistory.push(res)
        messageHistory.push(new HumanChatMessage("Now please assign a relevancy score between 0 (not relevant at all) and 100 (highly relevant) to the returned text snippet. ONLY output a single integer, no additional text."))
        const final_res: BaseChatMessage = await model.call(messageHistory);
        return {...result, judge_explanation: res.text, judge_score: final_res.text};
    }));
    //To fully use this, the general idea would be the following:
    //User sets limit of 10, API returns 50 results. All of them are prefiltered through an LLM of this kind and then sorted by relevancy score. only the top 5 are actually returned
}*/

/*export async function getLLMScores(query: string, results: Result[]) {
//This is not working, that's why it is commented out.
    const openai = new OpenAI();

    const functionTemplate = [
        {
            'name': 'get_relevance_score',
            'description': 'Rate the relevancy of the returned result on a scale from 0 to 100, where 0 means not relevant at all and 100 means very relevant. Explain your scoring.',
            'parameters': {
                'type': 'object',
                'properties': {
                    'score': {
                        'type': 'integer',
                        'description': 'A point score between 0 (irrelevant) and 100 (highly relevant) assigned to the result based on the query and the result\'s text.'
                    }
                }
            }
        }
    ]

    return await Promise.all(results.map(async (result) => {
        const messages: ChatCompletionMessageParam[] = [
            {
                "role": 'system',
                "content": "Your are an expert judge AI. You are given a user query and a text snippet from a document. You have to decide whether the text snippet is relevant to the query."
            },
            {
                "role": 'user',
                "content": query
            },
            {
                "role": 'system',
                "content": `From the document with the title ${result.name}, the following text snippet is returned to you:\n "${result.text}"`
            }
        ]

        const responses = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: messages,
            functions: functionTemplate
        });
        let score = 0;
        if (responses.choices[0].message.function_call?.arguments) {
            score = JSON.parse(responses.choices[0].message.function_call.arguments).score;
        }
        return {...result, judge_score: score};
    }));

}*/

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
        const {score, text, name, kind} = retrieved.results[i];
        const scoreAsPercentage = (score * 100).toFixed(2);
        const addition = `- **${name} (Confidence: ${scoreAsPercentage}%):** "${text}"\n`
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
    openAIMessageHistory.push(new SystemChatMessage('You are an expert writer and editor AI. You hold yourself to high journalistic standards and never invent or misrepresent information. You have been given the following writing task.' +
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
    openAIMessageHistory.push(new SystemChatMessage(`Instructions: You complete the writing task using the context provided below. Do not say that you do not know or need more information. Be concise and specific. Never repeat yourself. Refrain from using vacuous phrases that do not convey concrete information.\n\nContext:\n${stringifiedContext}\n\nText:\n`));
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