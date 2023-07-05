import React, {useState} from 'react';
import axios from 'axios';
import {getCookie} from "@/utils";

// This is a dummy function, replace it with your actual API call
const queryApi = async (text: string): Promise<any> => {

    try {
        const params = {
            query: text,
            limit: 3,
            refreshToken: getCookie('refreshToken'),
        }
        console.log(params);
        const endpoint = "api/query";
        const response = await axios.post(endpoint, params);
        return JSON.stringify(response.data);
    } catch (error) {
        return "Error fetching data from API: " + JSON.stringify(error);
    }
}

const SidContainer: React.FC = () => {
    const [inputText, setInputText] = useState<string>('');
    const [outputText, setOutputText] = useState<string>('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputText(e.target.value);
    };

    const handleButtonClick = async () => {
        const apiResponse = await queryApi(inputText);
        setOutputText(apiResponse);
    };

    return (
        <div style={{display: 'flex', flexDirection: 'column', maxWidth: '600px', margin: '0 auto'}}>
            <input
                type='text'
                value={inputText}
                onChange={handleInputChange}
                style={{
                    marginBottom: '10px',
                    padding: '10px',
                    fontSize: '16px',
                    border: '1px solid #ddd',
                    borderRadius: '5px'
                }}
            />
            <button
                onClick={handleButtonClick}
                style={{
                    marginBottom: '10px',
                    padding: '10px',
                    fontSize: '16px',
                    border: '1px solid #ddd',
                    borderRadius: '5px',
                    background: '#f0f0f0',
                    cursor: 'pointer'
                }}
            >
                Submit
            </button>
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
                    <h3>processed API Response</h3>
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
            </div>
        </div>
    );
};

export default SidContainer;
