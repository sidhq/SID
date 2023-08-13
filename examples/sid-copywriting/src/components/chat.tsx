import React, {useEffect, useState} from 'react';
import styles from "@/styles/Chat.module.scss";
import {TypingState, DemoProps} from "@/types";
import {typeInTerminal} from "@/utils";

export default function Chat({template}: DemoProps) {
    const [typingState, setTypingState] = useState<TypingState>(
        new Map([
            ['secondChatMessage', {
                typingRef: React.createRef<HTMLParagraphElement>(),
                typingQueue: [],
                typingOutput: [],
                isTyping: false,
                typingInterval: null,
            }],
            ['thirdChatMessage', {
                typingRef: React.createRef<HTMLParagraphElement>(),
                typingQueue: [],
                typingOutput: [],
                isTyping: false,
                typingInterval: null,
            }],
        ])
    );


    useEffect(() => {
        if (typingState && !typingState.get('secondChatMessage')?.isTyping && !typingState.get('thirdChatMessage')?.isTyping) {
            typeInTerminal(16, false, 'secondChatMessage', typingState, setTypingState).catch((err) => {
                console.log(err);
            });
            typeInTerminal(20, false, 'thirdChatMessage', typingState, setTypingState).catch((err) => {
                console.log(err);
            });
        }
        return () => {
        };
    }, [typingState]);

    useEffect(() => {
        //This triggers when a user selects a template
        if (template) {
            setTypingState(prev => {
                const newTypingState = new Map(prev);
                for (const [key, value] of Object.entries({
                    'secondChatMessage': template.outputWithSID,
                    'thirdChatMessage': template.outputWithoutSID,
                })) {
                    const refObj = newTypingState.get(key);
                    if (refObj) {
                        refObj.typingQueue.length = 0;
                        refObj.typingQueue.push(value);
                        newTypingState.set(key, refObj);
                    }
                }

                return newTypingState;
            });
        }
        return () => {
            //cleanup
            typingState?.forEach((value, key) => {
                clearInterval(value.typingInterval || undefined);
                setTypingState(prev => {
                    const newTypingState = new Map(prev);
                    const targetTypingState = newTypingState.get(key);
                    if (targetTypingState) {
                        targetTypingState.isTyping = false;
                        targetTypingState.typingOutput = [];
                    }
                    return newTypingState;
                });
            });
        };
    }, [template]);


    return (
        <div className={styles.mainWrapperChat}>
            <div className={styles.chatWrapper}>
                <div className={styles.chatBody}>
                    <div className={`${styles.chatMessage} ${styles.humanMessage}`}>
                        <p>{template?.input}</p>
                    </div>
                    <div className={`${styles.chatMessage} ${styles.sidgptMessage}`}>
                        <img src="static/images/sid-emoji.svg" alt="SID"/>
                        {typingState && typingState.get('secondChatMessage')?.typingOutput[0] ?
                            <p>{typingState.get('secondChatMessage')?.typingOutput[0]}</p>
                            : ''}
                    </div>
                    <div className={`${styles.chatMessage} ${styles.chatgptMessage}`}>
                        <img src="static/images/chatgpt-emoji.svg" alt="SID"/>
                        {typingState && typingState.get('secondChatMessage')?.typingOutput[0] ?
                            <p>{typingState.get('thirdChatMessage')?.typingOutput[0]}</p>
                            : ''}
                    </div>
                </div>
                <div className={styles.chatInput}>
                    <div className={styles.chatInputField}>
                        <input type="text"
                               disabled={true}
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