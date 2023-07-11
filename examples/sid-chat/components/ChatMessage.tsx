import React from "react";
import styles from '@/styles/ChatMessage.module.scss';

interface ChatMessageProps {
    isAIMessage: boolean;
    content: string;
    isTypingIndicator?: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({isAIMessage, content, isTypingIndicator}) => {
    return (
        <div className={`${styles.messageWrapper} ${isAIMessage ? styles.aiMessageWrapper : styles.userMessageWrapper}`}>
            <div className={`${styles.message} ${isAIMessage ? styles.aiMessage : styles.userMessage}`}>
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