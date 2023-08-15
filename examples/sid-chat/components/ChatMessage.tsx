import React from "react";
import styles from '@/styles/ChatMessage.module.scss';
import {IUser} from "@/components/ChatBox";

interface ChatMessageProps {
    isAIMessage: boolean;
    content: string;
    user: IUser;
    isTypingIndicator?: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({isAIMessage, content, user, isTypingIndicator}) => {
    return (
        <div
            className={`${styles.messageWrapper} ${isAIMessage ? styles.aiMessageWrapper : styles.userMessageWrapper}`}>
            {isAIMessage ?
                <div className={styles.avatarWrapper}>
                    <img src={user.avatar} alt="Avatar"/>
                </div> : null
            }
            <div className={`${styles.message} ${isAIMessage ? styles.aiMessage : styles.userMessage}`}>
                <div className={styles.messageHeader}>
                    <span className={styles.messageAuthor}>{user.name}</span>
                </div>
                {isTypingIndicator ?
                    <p className={styles.isTyping}>
                        <span>.</span>
                        <span>.</span>
                        <span>.</span>
                    </p> :
                    <p>{content}</p>
                }
            </div>
        </div>
    );
}
export default ChatMessage;