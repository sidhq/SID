import React from "react";
import styles from '@/styles/ChatMessage.module.scss';

interface ChatMessageProps {
    isAIMessage: boolean;
    content: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({isAIMessage, content}) => {
    return (
        <div className={styles.messageWrapper}>
            <div className={`${styles.message} ${isAIMessage ? styles.aiMessage : styles.userMessage}`}>
                <p>{content}</p>
            </div>
        </div>
    );
}
export default ChatMessage;