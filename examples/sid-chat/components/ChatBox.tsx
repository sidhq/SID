import React, {ChangeEvent, useEffect, useState} from "react";
import styles from '@/styles/ChatBox.module.scss';
import SidSVG from "@/components/SidSVG";
import ChatMessage from "@/components/ChatMessage";
import axios from "axios";
import {getCookie} from "@/utils";
import TerminalMessage from "@/components/TerminalMessage";

export interface IUser {
    name: string;
    avatar: string;
}
interface IMessage {
    isAIMessage: boolean;
    user: IUser;
    content: string;
    isTypingIndicator?: boolean;
}

interface ITerminalMessages {
    isUserCommand: boolean;
    content: string;
    copyableContent: string;
}

interface userInputTuple {
    userInput: string;
    userInputCopy: string
}


const ChatBox: React.FC = () => {


    const inputRef = React.createRef<HTMLInputElement>();
    const rightChatRef = React.createRef<HTMLDivElement>();
    const leftChatRef = React.createRef<HTMLDivElement>();
    const terminalRef = React.createRef<HTMLDivElement>();

    const [inputValue, setInputValue] = useState<string>('');  // State for input field
    const [messagesRightChat, setMessagesRightChat] = useState<IMessage[]>([]);  //State for right chat window, gpt+sid
    const [messagesLeftChat, setMessagesLeftChat] = useState<IMessage[]>([]);  //State for left chat window, gpt only
    const [messagesChat, setMessagesChat] = useState<IMessage[]>([]);  //State for chat window, gpt only
    const [terminalMessages, setTerminalMessages] = useState<ITerminalMessages[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);  // State for loading indicator
    const [isSIDConnected, setIsSIDConnected] = useState<boolean>(false);  // State for SID connection
    const [rawDataSID, setRawDataSID] = useState<string>('');  // State for raw data from SID
    const [terminalUserInput, setTerminalUserInput] = useState<userInputTuple | null>(null);  // State for user input in terminal
    const [terminalIsTyping, setTerminalIsTyping] = useState<boolean>(false);  // State for typing indicator in terminal
    const [terminalCursorQueue, setTerminalCursorQueue] = useState<ITerminalMessages[]>([]);  // queue for messages in terminal
    const [accessToken, setAccessToken] = useState<string>('');  // State for access tokens for the terminal
    const typeInTerminal = (delay: number) => {
        if (terminalCursorQueue.length > 0) {
            setTerminalIsTyping(true);
            const message = terminalCursorQueue[0];
            setTerminalCursorQueue(prev => prev.slice(1));

            const typedMessage: ITerminalMessages = {
                isUserCommand: message.isUserCommand,
                content: message.content,
                copyableContent: message.copyableContent,
            };
            setTerminalMessages(messages => [...messages, typedMessage]);
            setTerminalIsTyping(false);
        }
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    function getCURLString(accessToken: string, query: string, limit: number): userInputTuple {
        function truncated(accessToken: string) {
            return accessToken.slice(0, 3) + '...' + accessToken.slice(-3);
        }

        const curlCommand =
            'curl --request POST \\\n' +
            `  --url 'https://api.sid.ai/api/v1/users/me/data/query' \\\n` +
            `  --header 'Authorization: Bearer ${truncated(accessToken)}' \\\n` +
            `  --header 'Content-Type: application/json' \\\n` +
            `  --data '{"query" : "${query}", "limit" : ${limit} }'`

        const curlCommandCopy =
            'curl --request POST \\\n' +
            `  --url 'https://api.sid.ai/api/v1/users/me/data/query' \\\n` +
            `  --header 'Authorization: Bearer ${accessToken}' \\\n` +
            `  --header 'Content-Type: application/json' \\\n` +
            `  --data '{"query" : "${query}", "limit" : ${limit} }'`


        return {userInput: curlCommand, userInputCopy: curlCommandCopy};
    }
    const chatGPTSID : IUser = {
        name: 'ChatGPT + SID',
        avatar: 'https://i.imgur.com/7k12EPD.png'
    }

    const chatGPT : IUser = {
        name: 'ChatGPT',
        avatar: 'https://i.imgur.com/7k12EPD.png'
    }

    const humanUser : IUser = {
        name: 'You',
        avatar: 'https://i.imgur.com/7k12EPD.png'
    }

    const handleSend = async () => {
        if (isLoading || inputValue == '') return;
        setIsLoading(true);
        const query = inputValue;
        const limit = 5;
        setInputValue('');
        setTerminalUserInput(getCURLString(accessToken, query, limit));
        const oldMessagesRight: IMessage[] = [...messagesRightChat, {
            isAIMessage: false,
            user: humanUser,
            content: query,
        }];
        const oldMessagesLeft: IMessage[] = [...messagesLeftChat, {
            isAIMessage: false,
            user: humanUser,
            content: query,
        }];
        setMessagesRightChat([...oldMessagesRight, {
            isAIMessage: true,
            user: chatGPTSID,
            content: '',
            isTypingIndicator: true,
        }]);
        setMessagesLeftChat([...oldMessagesLeft, {
            isAIMessage: true,
            user: chatGPT,
            content: '',
            isTypingIndicator: true,
        }]);
        setMessagesChat([...oldMessagesLeft, {
            isAIMessage: true,
            user: chatGPT,
            content: '',
            isTypingIndicator: true,
        },{
            isAIMessage: true,
            user: chatGPTSID,
            content: '',
            isTypingIndicator: true,
        }]);
        try {
            const refreshToken = getCookie('refreshToken');
            let sidRawResponse = await axios.post('api/query', {
                messageHistory: oldMessagesRight,
                query: query,
                limit: limit,
                refreshToken: refreshToken,
                accessToken: accessToken,
                mode: "sid-raw",
            });
            setRawDataSID(JSON.stringify(sidRawResponse.data.answer, null, 2))
            const promises = [
                axios.post('api/query', {
                    messageHistory: oldMessagesRight,
                    query: query,
                    limit: limit,
                    refreshToken: refreshToken,
                    accessToken: accessToken,
                    mode: "sid-openai",
                }),
                axios.post('api/query', {
                    messageHistory: oldMessagesLeft,
                    query: query,
                    limit: limit,
                    mode: "openai",
                })
            ];
            const [responseSID, responseNoSID] = await Promise.all(promises);

            setIsLoading(false);
            if (responseNoSID.status === 200 && responseSID.status === 200) {
                setMessagesRightChat([...oldMessagesRight, {
                    isAIMessage: true,
                    user: chatGPTSID,
                    content: responseSID.data.answer,
                }]);
                setMessagesLeftChat([...oldMessagesLeft, {
                    isAIMessage: true,
                    user: chatGPT,
                    content: responseNoSID.data.answer,
                }]);
                setMessagesChat([...oldMessagesRight, {
                    isAIMessage: true,
                    user: chatGPT,
                    content: responseNoSID.data.answer,
                }, {
                    isAIMessage: true,
                    user: chatGPTSID,
                    content: responseSID.data.answer,
                }]);
            } else if (responseSID.status === 200) {
                setMessagesRightChat([...oldMessagesRight, {
                    isAIMessage: true,
                    user: chatGPTSID,
                    content: responseSID.data.answer,
                }]);
                setMessagesChat([...oldMessagesRight, {
                    isAIMessage: true,
                    user: chatGPTSID,
                    content: responseSID.data.answer,
                }]);
            } else if (responseNoSID.status === 200) {
                setMessagesLeftChat([...oldMessagesLeft, {
                    isAIMessage: true,
                    user: chatGPT,
                    content: responseNoSID.data.answer,
                }]);
                setMessagesChat([...oldMessagesRight, {
                    isAIMessage: true,
                    user: chatGPT,
                    content: responseNoSID.data.answer,
                }]);
            }
        } catch (err) {
            console.error(err);
            setIsLoading(false);
            const userErrorMessage: string = 'Something went wrong. Sorry for that! Please refresh the page and try again.';
            setMessagesRightChat([...messagesRightChat, {
                isAIMessage: true,
                user: chatGPTSID,
                content: userErrorMessage,
            }]);
            setMessagesChat([...messagesRightChat, {
                isAIMessage: true,
                user: chatGPTSID,
                content: userErrorMessage,
            }]);
            setRawDataSID(JSON.stringify(
                {error: userErrorMessage}, null, 2));
            setMessagesLeftChat([...oldMessagesLeft, {
                isAIMessage: true,
                user: chatGPT,
                content: userErrorMessage,
            }]);

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
            const newUserMessage: ITerminalMessages = {
                isUserCommand: true,
                content: terminalUserInput.userInput,
                copyableContent: terminalUserInput.userInputCopy,
            };
            //add user input to message queue
            setTerminalCursorQueue(prev => [...prev, newUserMessage]);
            //clear user input
            setTerminalUserInput(null);
        }

        if (rawDataSID) {
            const newSystemMessage: ITerminalMessages = {
                isUserCommand: false,
                content: rawDataSID,
                copyableContent: rawDataSID,
            };
            //add user input to message queue
            setTerminalCursorQueue(prev => [...prev, newSystemMessage]);
            //clear user input
            setRawDataSID('');
        }

        //start typingEngine if it is not already running
        if (!terminalIsTyping) {
            typeInTerminal(100);   //2000=delay per message
        }
    }, [terminalUserInput, rawDataSID, terminalIsTyping]);

    useEffect(() => {
        if (leftChatRef.current) {
            leftChatRef.current.scrollTop = leftChatRef.current.scrollHeight;
        }
    }, [messagesChat]);

    useEffect(() => {
        if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
    }, [terminalMessages]);

    useEffect(() => {
        const refreshToken = getCookie('refreshToken');
        //fetch to api/getAccessToken to get access token from refreshToken
        axios.post('api/getAccessToken', {
            refreshToken: refreshToken,
        }).then((response) => {
            //set access token
            setAccessToken(response.data.accessToken);
        }).catch((err) => {
            setAccessToken('<access_token>');
        });
    }, []);

    return (
        <div className={styles.mainWrapper}>
            <div className={styles.headingWrapper}>
                <h3>ChatGPT</h3>
                <h3>ChatGPT + <SidSVG width={35} height={35} fill={'#F4E7D4'}/></h3>
            </div>
            <div className={styles.chatBoxWrapper}>
                <div className={styles.chatBoxLeft} ref={leftChatRef}>
                    {messagesChat.map((message, i) =>
                        <ChatMessage key={i} isAIMessage={message.isAIMessage} content={message.content} user={message.user}
                                     isTypingIndicator={message.isTypingIndicator}/>
                    )}
                </div>
            </div>
            <div className={styles.rawDataWrapper}>
                <h4>SID Terminal</h4>
                <div className={styles.terminal} ref={terminalRef}>
                    {terminalMessages.map((message, i) =>
                        <TerminalMessage key={i} isUserCommand={message.isUserCommand} content={message.content}
                                         clipboardContent={message.copyableContent}/>
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