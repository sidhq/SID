import {initializeAgentExecutorWithOptions} from "langchain/agents";
import {ChatOpenAI} from "langchain/chat_models/openai";
import {SerpAPI} from "langchain/tools";
import {Calculator} from "langchain/tools/calculator";
import {SidTool} from "@/utils/sidTool";

class reactAgent {

    private readonly sidTool: SidTool;

    constructor(sidTool: SidTool) {
        this.sidTool = sidTool;
    }

    protected async run(): Promise<void> {
        const model = new ChatOpenAI({
            temperature: 0,
            modelName: 'gpt-4'
        });
        const tools = [
            new SerpAPI(process.env.SERPAPI_API_KEY, {
                location: "San Francisco,California,United States",
                hl: "en",
                gl: "us",
            }),
            new Calculator(),
        ];

        const executor = await initializeAgentExecutorWithOptions(tools, model, {
            agentType: "chat-zero-shot-react-description",
            returnIntermediateSteps: true,
        });
        console.log("Loaded agent.");

        const input = `What is SID?`;

        console.log(`Executing with input "${input}"...`);

        const result = await executor.call({input});

        console.log(`Got output ${result.output}`);

        console.log(
            `Got intermediate steps ${JSON.stringify(
                result.intermediateSteps,
                null,
                2
            )}`
        );
    };
}