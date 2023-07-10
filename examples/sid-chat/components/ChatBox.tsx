import React, {ChangeEvent, useEffect, useState} from "react";
import styles from '@/styles/ChatBox.module.scss';
import SidSVG from "@/components/SidSVG";
import ChatMessage from "@/components/ChatMessage";
import axios from "axios";
import {getCookie} from "@/utils";
import TerminalMessage from "@/components/TerminalMessage";

interface IMessage {
    isAIMessage: boolean;
    content: string;
}

interface ITerminalMessages {
    isUserCommand: boolean;
    content: string;
}


const ChatBox: React.FC = () => {

    const [inputValue, setInputValue] = useState<string>('');  // State for input field
    const [messagesRightChat, setMessagesRightChat] = useState<IMessage[]>([]);  //State for right chat window, gpt+sid
    const [messagesLeftChat, setMessagesLeftChat] = useState<IMessage[]>([]);  //State for left chat window, gpt only
    const [terminalMessages, setTerminalMessages] = useState<ITerminalMessages[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);  // State for loading indicator
    const [rawDataSID, setRawDataSID] = useState<string>('');  // State for raw data from SID
    const [terminalUserInput, setTerminalUserInput] = useState<string>('');  // State for raw data from SID
    const [terminalIsTyping, setTerminalIsTyping] = useState<boolean>(false);  // State for raw data from SID
    const [terminalCursorQueue, setTerminalCursorQueue] = useState<ITerminalMessages[]>([]);  // State for raw data from SID
    const typeInTerminal = (delay: number) => {
        //while terminalMessages is not empty
        if (terminalCursorQueue.length > 0) {
            setTerminalIsTyping(true);
            //set terminalIsTyping to true
            //get first message from terminalMessages
            const message = terminalCursorQueue[0];
            //remove first message from terminalMessages
            setTerminalCursorQueue(prev => prev.slice(1));
            if (message.isUserCommand) {
                //message is user command
                setTerminalMessages(prev => [...prev, message]);
            } else {
                setTerminalMessages(prev => [...prev, message]);
                //message is system command
            }
            setTerminalIsTyping(false);
        }
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    const handleSend = async () => {
        setIsLoading(true);
        const query = inputValue;
        const limit = 5;
        setInputValue('');
        setTerminalUserInput(
            'curl --request POST \\\n' +
            `  --url 'https://api.sid.ai/api/v1/users/me/data/query' \\\n` +
            `  --header 'Authorization: Bearer <access_token>' \\\n` +
            `  --header 'Content-Type: application/json' \\\n` +
            `  --data '{"query" : "${query}", "limit" : ${limit} }'`
        );
        setMessagesRightChat(oldMessages => [...oldMessages, {
            isAIMessage: false,
            content: query,
        }]);
        setMessagesLeftChat(oldMessages => [...oldMessages, {
            isAIMessage: false,
            content: query,
        }]);
        try {
            const refreshToken = getCookie('refreshToken');
            const promises = [
                axios.post('api/query', {
                    messageHistory: messagesRightChat,
                    query: query,
                    limit: limit,
                    refreshToken: refreshToken,
                    sidEnabled: true,
                }),
                axios.post('api/query', {
                    messageHistory: messagesLeftChat,
                    query: query,
                    limit: limit,
                    refreshToken: refreshToken,
                    sidEnabled: false,
                })
            ];

            const [responseSID, responseNoSID] = await Promise.all(promises);

            setIsLoading(false);
            if (responseSID.status === 200) {
                setMessagesRightChat(oldMessages => [...oldMessages, {
                    isAIMessage: true,
                    content: responseSID.data.answer,
                }]);
                setRawDataSID(JSON.stringify(responseSID.data.rawData));
            }

            if (responseNoSID.status === 200) {
                setMessagesLeftChat(oldMessages => [...oldMessages, {
                    isAIMessage: true,
                    content: responseNoSID.data.answer,
                }]);
            }
        } catch (err) {
            setIsLoading(false);
            console.error(err);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSend();
        }
    }

    useEffect(() => {
        //if new user input
        if (terminalUserInput) {
            const newUserMessage = {
                isUserCommand: true,
                content: terminalUserInput,
            };
            //add user input to message queue
            setTerminalCursorQueue(prev => [...prev, newUserMessage]);
            //clear user input
            setTerminalUserInput('');
        }

        if (rawDataSID) {
            const newSystemMessage = {
                isUserCommand: false,
                content: rawDataSID,
            };
            //add user input to message queue
            setTerminalCursorQueue(prev => [...prev, newSystemMessage]);
            //clear user input
            setRawDataSID('');
        }

        //start typingEngine if it is not already running
        if (!terminalIsTyping) {
            typeInTerminal(25);
        }
    }, [terminalUserInput, rawDataSID]);

    useEffect(() => {
        setMessagesRightChat([{
            isAIMessage: true,
            content: 'Hi, I am ChatGPT! How can I help you today?',
        }]);
    }, []);

    useEffect(() => {
        setMessagesLeftChat([{
            isAIMessage: true,
            content: 'Hi, I am ChatGPT! How can I help you today?',
        }]);
    }, []);

    return (
        <div className={styles.mainWrapper}>
            <div className={styles.headingWrapper}>
                <h3>ChatGPT</h3>
                <h3>ChatGPT + <SidSVG width={35} height={35} fill={'#F4E7D4'}/></h3>
            </div>
            <div className={styles.chatBoxWrapper}>
                <div className={styles.chatBoxLeft}>
                    {messagesLeftChat.map((message, i) =>
                        <ChatMessage key={i} isAIMessage={message.isAIMessage} content={message.content}/>
                    )}
                </div>
                <div className={styles.chatBoxRight}>
                    {messagesRightChat.map((message, i) =>
                        <ChatMessage key={i} isAIMessage={message.isAIMessage} content={message.content}/>
                    )}
                </div>
            </div>
            <div className={styles.rawDataWrapper}>
                <h4>SID Terminal</h4>
                <div className={styles.terminal}>
                    {terminalMessages.map((message, i) =>
                        <TerminalMessage key={i} isUserCommand={message.isUserCommand} content={message.content}/>
                    )}
                </div>
            </div>
            <div className={styles.chatBoxInputWrapper}>
                <input
                    className={styles.chatBoxInput}
                    placeholder="Write a reply..."
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    disabled={isLoading}
                />
                <button
                    className={styles.chatBoxSendButton}
                    onClick={handleSend}
                    disabled={isLoading}
                >Send
                </button>
            </div>
        </div>
    );
}

export default ChatBox;