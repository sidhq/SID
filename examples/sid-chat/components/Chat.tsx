import React, {ChangeEvent, useEffect} from 'react';
import styles from "@/styles/Chat.module.scss";

interface ChatProps {
    children: React.ReactNode;
    value: string;
    disabled: boolean;
    handleSend: () => void;
    handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export default function Chat({children, value, disabled, handleSend, handleInputChange}: ChatProps) {
    const chatRef = React.createRef<HTMLDivElement>();
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSend();
        }
    }

    useEffect(() => {
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    }, [children]);

    return (
        <div className={styles.mainWrapperChat}>
            <div className={styles.chatWrapper}>
                <div
                    ref={chatRef}
                    className={styles.chatBody}>
                    {children}
                </div>
                <div className={styles.chatInput}>
                    <div className={styles.chatInputField}>
                        <input type="text"
                               disabled={disabled}
                               value={value}
                               onChange={handleInputChange}
                               onKeyDown={handleKeyDown}
                               placeholder={'Type your message here...'}/>
                        <button disabled={disabled} onClick={() => {handleSend()}}>
                            <img src="static/images/paperplane.svg" alt="Send"/>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

}