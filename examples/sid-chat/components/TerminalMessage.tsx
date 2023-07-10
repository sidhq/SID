import React from "react";
import styles from '@/styles/TerminalMessage.module.scss';

interface TerminalMessageProps {
    isUserCommand: boolean;
    content: string;
}

const TerminalMessage: React.FC<TerminalMessageProps> = ({isUserCommand, content}) => {
    return (
        <div className={styles.messageWrapper}>
            <div className={`${styles.message} ${isUserCommand ? styles.userMessage : styles.systemMessage}`}>
                <pre>{content}</pre>
            </div>
        </div>
    );
}
export default TerminalMessage;