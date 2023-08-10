import React, {useEffect, useState} from 'react';
import styles from "@/styles/EmailWriting.module.scss";
import {TypingState, DemoProps} from "@/types";
import {typeInTerminal} from "@/utils";

export default function EmailWriting({template}: DemoProps) {
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
    const formattedDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
    const formattedTime = new Date().toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
    });

    useEffect(() => {
        if (typingState && !typingState.get('inputRef')?.isTyping && !typingState.get('withSIDRef')?.isTyping && !typingState.get('withoutSIDRef')?.isTyping) {
            typeInTerminal(1000, true, 'inputRef', typingState, setTypingState)
                .then(() => {
                    typeInTerminal(2000, true, 'withSIDRef', typingState, setTypingState).catch((err) => {
                        console.log(err);
                    });
                    typeInTerminal(2000, true, 'withoutSIDRef', typingState, setTypingState).catch((err) => {
                        console.log(err);
                    });
                })
                .catch((err) => {
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
                    'inputRef': template.input,
                    'withSIDRef': template.outputWithSID,
                    'withoutSIDRef': template.outputWithoutSID,
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
        <div className={styles.mainWrapperEmailWriting}>
            <div className={styles.taskContainer}>
                <label className={styles.taskText}>Task:</label>
                <input className={styles.taskTextBox}
                       placeholder={'Select an example to see SID in action!'}
                       ref={typingState ? typingState.get('inputRef')?.typingRef as unknown as React.RefObject<HTMLInputElement> : null}
                       disabled={true}
                       value={typingState ? typingState.get('inputRef')?.typingOutput.map((message) => {
                           return message;
                       }).join('') : ''}
                />
            </div>
            <div className={styles.textEditorContainer}>
                <div className={styles.textEditorHeader}
                     style={{backgroundImage: 'url(/static/images/email-client-fake-menu.svg)'}}>
                </div>
                <div className={styles.emailHeader}>
                    <div className={styles.emailHeaderLeft}>
                        <div className={styles.emailHeaderLeftIcon}
                             style={{backgroundImage: 'url(/static/images/email-client-fake-icon.svg)'}}
                        />
                        <span className={styles.emailSender}>Lotte Seifert</span>
                        <span className={styles.emailSubject}>Demo Mail Subject Line</span>
                        <span className={styles.emailRecipient}>To: <span>John Doe</span></span>
                    </div>
                    <div className={styles.emailHeaderRight}><span>{`${formattedDate} at ${formattedTime}`}</span></div>
                </div>
                <div className={styles.textEditorBody}>
                    <div className={styles.textEditorWithSID}>
                        <h4>Text Generation <span> with SID</span></h4>
                        <p ref={typingState ? typingState.get('withSIDRef')?.typingRef as unknown as React.RefObject<HTMLInputElement> : null}>{typingState ? typingState.get('withSIDRef')?.typingOutput.map((message, index) => {
                            return (
                                <span key={`email_with_sid_${index}`} dangerouslySetInnerHTML={{__html: message}}/>);
                        }) : ''}
                            <span className={styles.cursor}/>
                        </p>
                    </div>
                    <div className={styles.textEditorWithoutSID}>
                        <h4>Text Generation <span> without SID</span></h4>
                        <p ref={typingState ? typingState.get('withoutSIDRef')?.typingRef as unknown as React.RefObject<HTMLInputElement> : null}>{typingState ? typingState.get('withoutSIDRef')?.typingOutput.map((message, index) => {
                            return (
                                <span key={`email_without_sid_${index}`} dangerouslySetInnerHTML={{__html: message}}/>);
                        }) : ''}
                            <span className={styles.cursor}/>
                        </p>
                    </div>
                </div>
            </div>
            <div className={styles.sneakBehindTheCurtainContainer}>
                <button>Sneak behind the curtain</button>
            </div>
        </div>
    );
}
