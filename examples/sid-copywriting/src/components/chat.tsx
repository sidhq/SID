import React, {useEffect, useState} from 'react';
import styles from "@/styles/Chat.module.scss";
import {TypingState, DemoProps} from "@/types";
import {typeInTerminal} from "@/utils";

export default function CopyWriting({template}: DemoProps) {
    const [typingState, setTypingState] = useState<TypingState>(
        new Map([
            ['inputRef', {
                typingRef: React.createRef<HTMLInputElement>(),
                typingQueue: [],
                typingOutput: [],
                isTyping: false,
                typingInterval: null,
            }],
            ['withSIDRef', {
                typingRef: React.createRef<HTMLParagraphElement>(),
                typingQueue: [],
                typingOutput: [],
                isTyping: false,
                typingInterval: null,
            }],
            ['withoutSIDRef', {
                typingRef: React.createRef<HTMLParagraphElement>(),
                typingQueue: [],
                typingOutput: [],
                isTyping: false,
                typingInterval: null,
            }],
        ])
    );

    return (
        <div className={styles.mainWrapperChat}>
            <div className={styles.chatWrapper}>
                <div className={styles.chatBody}>
                    <div className={`${styles.chatMessage} ${styles.humanMessage}`}>
                        <p>What does SID do?</p>
                    </div>
                    <div className={`${styles.chatMessage} ${styles.sidgptMessage}`}>
                        <img src="static/images/sid-emoji.svg" alt="SID"/>
                        <p>SID is an AI assistant that can run in the background of your device. It can be called upon at any time to answer questions you have. SID's capabilities can be extended by linking directories and...</p>
                    </div>
                    <div className={`${styles.chatMessage} ${styles.chatgptMessage}`}>
                        <img src="static/images/chatgpt-emoji.svg" alt="ChatGPT"/>
                        <p>Could you please provide more context? SID could refer to a number of things, such as a Security Identifier in computing or Sudden Infant Death syndrome in health</p>
                    </div>
                </div>
                <div className={styles.chatInput}>
                    <div className={styles.chatInputField}>
                        <input type="text"
                               ref={typingState ? typingState.get('inputRef')?.typingRef as unknown as React.RefObject<HTMLInputElement> : null}
                               placeholder={'Type your message here...'}/>
                        <button>
                            <img src="static/images/paperplane.svg" alt="Send"/>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

}