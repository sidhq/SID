import React, {ChangeEvent, useEffect, useState} from "react";
import styles from '@/styles/ChatBox.module.scss';
import SidSVG from "@/components/SidSVG";
import axios from "axios";
import {getCookie} from "@/utils";
import TerminalMessage from "@/components/TerminalMessage";

interface IMessage {
    isAIMessage: boolean;
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
    const [terminalMessages, setTerminalMessages] = useState<ITerminalMessages[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);  // State for loading indicator
    const [isSIDConnected, setIsSIDConnected] = useState<boolean>(false);  // State for SID connection
    const [rawDataSID, setRawDataSID] = useState<string>('');  // State for raw data from SID
    const [terminalUserInput, setTerminalUserInput] = useState<userInputTuple | null>(null);  // State for user input in terminal
    const [terminalIsTyping, setTerminalIsTyping] = useState<boolean>(false);  // State for typing indicator in terminal
    const [terminalCursorQueue, setTerminalCursorQueue] = useState<ITerminalMessages[]>([]);  // queue for messages in terminal
    const [accessToken, setAccessToken] = useState<string>('');  // State for access tokens for the terminal
    const typeInTerminal = (delay: number) => {
        //while terminalMessages is not empty
        if (terminalCursorQueue.length > 0) {
            setTerminalIsTyping(true);
            //set terminalIsTyping to true
            //get first message from terminalMessages
            const message = terminalCursorQueue[0];
            //remove first message from terminalMessages
            setTerminalCursorQueue(prev => prev.slice(1));

            let i = 0;
            const typedMessage: ITerminalMessages = {
                isUserCommand: message.isUserCommand,
                content: '',
                copyableContent: message.copyableContent,
            };
            const currentTerminalMessages = terminalMessages;
            const numberOfCharacters = Math.max(message.content.length, 1);
            let typingDuration = Math.ceil(delay / numberOfCharacters);
            const typingDurationThreshold = 8;
            let charMultiplier = 1;
            if (typingDuration < typingDurationThreshold) {
                charMultiplier = typingDurationThreshold / typingDuration;
                typingDuration = typingDurationThreshold;
            }
            let intPart = Math.floor(charMultiplier);
            let decimalPart = charMultiplier - intPart;
            const typingInterval = setInterval(() => {
                let addedString = '';
                for (let j = 0; j < intPart; j++) {
                    if (i < message.content.length) {
                        addedString += message.content[i];
                        i++;
                    }
                }
                //PURE MAGIC
                if (Math.random() < decimalPart && i < message.content.length) {
                    addedString += message.content[i];
                    i++;
                }
                typedMessage.content += addedString;
                setTerminalMessages([...currentTerminalMessages, typedMessage]);
                if (i > message.content.length - 1) {
                    clearInterval(typingInterval);
                    setTerminalIsTyping(false);
                }
            }, typingDuration);
        }
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };


    function strToTerminal(str: string): userInputTuple {
        return {userInput: str, userInputCopy: str};
    }

    const handleSend = async () => {
        if (isLoading || inputValue == '') return;
        setIsLoading(true);
        const query = inputValue;
        setInputValue('');
        setTerminalUserInput(strToTerminal('Starting Auto-GPT...'));
        setTimeout(() => {
            setTerminalUserInput(strToTerminal('Goal is: ' + query));
        }, 1000);

        try {
            const refreshToken = getCookie('refreshToken');
            const source = new EventSource(`api/query?query=${query}&refreshToken=${refreshToken}`);

            // Handle incoming messages
            source.onmessage = function(event) {
                // Parse the JSON string back into an object
                const data = JSON.parse(event.data);
                console.log(data);  // Here's your data!
                setRawDataSID(JSON.stringify(data, null, 2));

                // You can update the UI or do anything you want with the data here.
                // This code block will be executed every time a new event comes from the server.
            };

            // Handle any errors
            source.onerror = function(err) {
                console.error("EventSource failed:", err);
                const userErrorMessage: string = 'Something went wrong. Sorry for that! Please refresh the page and try again.';
                setRawDataSID(JSON.stringify({error: err}, null, 2));
            };

        } catch (err) {
            console.error(err);
            setIsLoading(false);
            const userErrorMessage: string = 'Something went wrong. Sorry for that! Please refresh the page and try again.';
            setRawDataSID(JSON.stringify({error: userErrorMessage}, null, 2));
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
            typeInTerminal(2000);   //2000=delay per message
        }
    }, [terminalUserInput, rawDataSID, terminalIsTyping]);

    useEffect(() => {
        if (rightChatRef.current) {
            rightChatRef.current.scrollTop = rightChatRef.current.scrollHeight;
        }
    }, [messagesRightChat]);

    useEffect(() => {
        if (leftChatRef.current) {
            leftChatRef.current.scrollTop = leftChatRef.current.scrollHeight;
        }
    }, [messagesLeftChat]);

    useEffect(() => {
        if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
    }, [terminalMessages]);


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
                <h3>Auto-GPT + <SidSVG width={35} height={35} fill={'#F4E7D4'}/></h3>
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
                    placeholder="Define a goal..."
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