import React, {ChangeEvent, useEffect, useState} from "react";
import styles from '@/styles/ChatBox.module.scss';
import SidSVG from "@/components/SidSVG";
import ChatMessage from "@/components/ChatMessage";
import axios from "axios";
import {APIResponse, getCookie} from "@/utils";

interface IMessage {
    isAIMessage: boolean;
    content: string;
}


const ChatBox: React.FC = () => {

    const [inputValue, setInputValue] = useState<string>('');  // State for input field
    const [messagesSID, setMessagesSID] = useState<IMessage[]>([]);  // State for chat messagesSID
    const [messagesNoSID, setMessagesNoSID] = useState<IMessage[]>([]);  // State for chat messagesNoSID
    const [isLoading, setIsLoading] = useState<boolean>(false);  // State for loading indicator

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    const handleSend = async () => {
        setIsLoading(true);
        const input = inputValue;
        setInputValue('');
        setMessagesSID(oldMessages => [...oldMessages, {
            isAIMessage: false,
            content: input,
        }]);
        setMessagesNoSID(oldMessages => [...oldMessages, {
            isAIMessage: false,
            content: input,
        }]);
        try {
            const promises = [
                axios.post('api/query', {
                    messageHistory: messagesSID,
                    query: input,
                    limit: 5,
                    refreshToken: getCookie('refreshToken'),
                    sidEnabled: true,
                }),
                axios.post('api/query', {
                    messageHistory: messagesNoSID,
                    query: input,
                    limit: 5,
                    refreshToken: getCookie('refreshToken'),
                    sidEnabled: false,
                })
            ];

            const [responseSID, responseNoSID] = await Promise.all(promises);

            setIsLoading(false);
            if (responseSID.status === 200) {
                setMessagesSID(oldMessages => [...oldMessages, {
                    isAIMessage: true,
                    content: responseSID.data.answer,
                }]);
            }

            if (responseNoSID.status === 200) {
                setMessagesNoSID(oldMessages => [...oldMessages, {
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
        setMessagesSID([{
            isAIMessage: true,
            content: 'Hi, I am ChatGPT! How can I help you today?',
        }]);
    }, []);

    useEffect(() => {
        setMessagesNoSID([{
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
                    {messagesNoSID.map((message, i) =>
                        <ChatMessage key={i} isAIMessage={message.isAIMessage} content={message.content}/>
                    )}
                </div>
                <div className={styles.chatBoxRight}>
                    {messagesSID.map((message, i) =>
                        <ChatMessage key={i} isAIMessage={message.isAIMessage} content={message.content}/>
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