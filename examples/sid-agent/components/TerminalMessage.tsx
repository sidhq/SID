import React from "react";
import styles from '@/styles/TerminalMessage.module.scss';

interface TerminalMessageProps {
    isUserCommand: boolean;
    content: string;
    clipboardContent: string;
}

const TerminalMessage: React.FC<TerminalMessageProps> = ({isUserCommand, content, clipboardContent}) => {
    const handleCopyToClipboard = () => {
        navigator.clipboard.writeText(clipboardContent).then(() => {
            console.log(`Copied '${clipboardContent}' to clipboard`);
        });
    };

    return (
        <div className={styles.messageWrapper} onClick={handleCopyToClipboard}>
            <div className={`${styles.message} ${isUserCommand ? styles.userMessage : styles.systemMessage}`}>
                <pre>{content}</pre>
            </div>
        </div>
    );
}
export default TerminalMessage;