import React, {useState} from 'react';
import axios from 'axios';
import {APIResponse, getCookie} from "@/utils";

// This is a dummy function, replace it with your actual API call
const queryApi = async (text: string, limit: number): Promise<any> => {

    try {
        const params = {
            query: text,
            limit: limit,
            refreshToken: getCookie('refreshToken'),
        }
        console.log(params);
        const endpoint = "api/query";
        const response = await axios.post(endpoint, params);
        return JSON.stringify(response.data);
    } catch (error) {
        console.log("Error fetching data from API: " + JSON.stringify(error))
        return JSON.stringify({results: [("Error fetching data from API: " + JSON.stringify(error)), 'Result 1', 'Result 2', 'Result 3']});
    }
}


const queryContext = async (text: string, retrieved: APIResponse): Promise<any> => {

    try {
        const endpoint = "api/contextualize";
        const body = {
            retrieved: retrieved,
            initial_query: text,
        }
        const response = await axios.post(endpoint, body);
        return JSON.stringify(response.data.response);
    } catch (error) {
        return "Error fetching data from API: " + JSON.stringify(error);
    }
}

const SidContainer: React.FC = () => {
    const [inputText, setInputText] = useState<string>('');
    const [limit, setLimitText] = useState<number>(3);
    const [outputText, setOutputText] = useState<string>('');
    const [contextualizedOutputText, setContextualizedOutputText] = useState<string>('');
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputText(e.target.value);
    };

    const handleLimitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLimitText(parseInt(e.target.value));
    };

    const handleButtonClick = async () => {
        const apiResponse = await queryApi(inputText, limit);
        setOutputText(apiResponse);
        const contextualizedApiResponse = await queryContext(inputText, JSON.parse(apiResponse));
        setContextualizedOutputText(contextualizedApiResponse);
    };

    return (
        <div style={{display: 'flex', flexDirection: 'column', maxWidth: '600px', margin: '0 auto'}}>
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                gap: '20px',
            }}>
                <input
                    type='text'
                    value={inputText}
                    placeholder={"Query"}
                    onChange={handleInputChange}
                    style={{
                        padding: '10px',
                        fontSize: '16px',
                        border: '1px solid #ddd',
                        borderRadius: '5px',
                        flex: 5
                    }}
                />
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                }}><span>Retrieval limit:</span></div>
                <input
                    type='number'
                    min={1}
                    max={100}
                    defaultValue={3}
                    placeholder={"Limit"}
                    onChange={handleLimitChange}
                    style={{
                        padding: '10px 0 10px',
                        fontSize: '16px',
                        textAlign: 'center',
                        border: '1px solid #ddd',
                        borderRadius: '5px',
                        width: '10%',
                        flex: 1
                    }}
                />
                <button
                    onClick={handleButtonClick}
                    style={{
                        padding: '10px',
                        fontSize: '16px',
                        border: '1px solid #ddd',
                        borderRadius: '5px',
                        background: '#f0f0f0',
                        cursor: 'pointer',
                        flex: 1
                    }}
                >
                    Submit
                </button>

            </div>
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                gap: '20px',
            }}>
                <div style={{
                    flex: 1,
                }}>
                    <h3>raw API Response</h3>
                    <textarea
                        value={outputText}
                        readOnly
                        style={{
                            height: '150px',
                            width: '100%',
                            padding: 0,
                            fontSize: '16px',
                            border: '1px solid #ddd',
                            borderRadius: '5px'
                        }}
                    />
                </div>
                <div style={{
                    flex: 1,
                }}>
                    <h3>GPT-4 processed API Response</h3>
                    <textarea
                        value={contextualizedOutputText}
                        readOnly
                        style={{
                            height: '150px',
                            width: '100%',
                            padding: 0,
                            fontSize: '16px',
                            border: '1px solid #ddd',
                            borderRadius: '5px'
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default SidContainer;
