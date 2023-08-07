import React, {ChangeEvent, useEffect, useState} from 'react';
import styles from "@/styles/CopyWriting.module.scss";
import {json} from "stream/consumers";

interface Template {
    buttonText: string;
    backgroundImage: string;
    input: string;
    outputWithSID: string;
    outputWithoutSID: string;
}

type TypingState = Map<string, {
    typingRef: React.RefObject<HTMLElement>,
    typingQueue: string[],
    typingOutput: string[],
    isTyping: boolean,
    typingInterval: NodeJS.Timer | null,
}> | null;

export default function CopyWriting() {

    const [activeTemplate, setActiveTemplate] = useState<Template | null>(null);  // queue for messages in terminal

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

    const templates: Template[] = [{
        buttonText: 'Twitter Thread',
        backgroundImage: 'url(/static/images/bird.svg)',
        input: 'Write a twitter thread about SID...',
        outputWithSID: 'SID is an AI that crafts tweets based on millions of existing tweets.',
        outputWithoutSID: 'Craft tweets with the precision of human-like quality.',
    }, {
        buttonText: 'Sales Outreach',
        backgroundImage: 'url(/static/images/handshake.svg)',
        input: 'Write a sales outreach email to a potential customer...',
        outputWithSID: 'SID crafts persuasive sales emails by analyzing millions of outreach messages.',
        outputWithoutSID: 'Generate compelling sales emails effortlessly.',
    }, {
        buttonText: 'Customer Support Email',
        backgroundImage: 'url(/static/images/mail.svg)',
        input: 'Write a customer support email to a customer...',
        outputWithSID: 'SID can write empathetic customer support emails based on vast data.',
        outputWithoutSID: 'Achieve excellent customer support with finely-tuned emails.',
    }, {
        buttonText: 'Launch Presentation',
        backgroundImage: 'url(/static/images/stocks.svg)',
        input: 'Write a presentation for the launch of SID...',
        outputWithSID: 'SID crafts presentations based on millions of slides, ensuring quality.',
        outputWithoutSID: 'Design powerful launch presentations with ease.',
    }, {
        buttonText: 'Other Examples',
        backgroundImage: 'url(/static/images/rocket-ship.svg)',
        input: 'Write a...',
        outputWithSID: 'SID is versatile, trained on millions of documents for accurate writing.',
        outputWithoutSID: 'Harness AI\'s potential for diverse writing tasks.',
    }];
    const typeInTerminal = async (delay: number, perMessage: boolean, target: string): Promise<void> => {
        return new Promise(async (resolve) => {
            if (typingState) {
                const targetTypingState = typingState.get(target);
                if (targetTypingState && targetTypingState.typingQueue.length > 0) {
                    //set cursorIsTyping to true in the typingState
                    setTypingState(prev => {
                        const newTypingState = new Map(prev);
                        const targetTypingState = newTypingState.get(target);
                        if (targetTypingState) {
                            targetTypingState.isTyping = true;
                        }
                        return newTypingState;
                    });

                    //get first message from typingQueue
                    const message = typingState.get(target)?.typingQueue[0];
                    if (message) {
                        //remove first message from typingQueue
                        setTypingState(prev => {
                            const newTypingState = new Map(prev);
                            const targetTypingState = newTypingState.get(target);
                            if (targetTypingState) {
                                targetTypingState.typingQueue = targetTypingState.typingQueue.slice(1);
                            }
                            return newTypingState;
                        });

                        let i = 0;
                        let typedMessage: string = '';
                        //do the following for the current target
                        //const currentMessages = typingOutput;
                        const currentMessages: string[] = typingState.get(target)?.typingOutput || [];

                        const numberOfCharacters = Math.max(message.length, 1);
                        let typingDuration = Math.ceil(delay / numberOfCharacters);
                        const typingDurationThreshold = 8;
                        let charMultiplier = 1;
                        if (typingDuration < typingDurationThreshold) {
                            charMultiplier = typingDurationThreshold / typingDuration;
                            typingDuration = typingDurationThreshold;
                        }
                        let intPart = Math.floor(charMultiplier);
                        let decimalPart = charMultiplier - intPart;
                        const typingInterval = setInterval(() => {
                            setTypingState(prev => {
                                const newTypingState = new Map(prev);
                                const targetTypingState = newTypingState.get(target);
                                if (targetTypingState) {
                                    console.log(typingInterval);
                                    targetTypingState.typingInterval = typingInterval;
                                }
                                return newTypingState;
                            });
                            let addedString = '';
                            if (perMessage) {
                                for (let j = 0; j < intPart; j++) {
                                    if (i < message.length) {
                                        addedString += message[i];
                                        i++;
                                    }
                                }
                                //PURE MAGIC
                                if (Math.random() < decimalPart && i < message.length) {
                                    addedString += message[i];
                                    i++;
                                }
                            } else {
                                addedString = message[i];
                                i++;
                            }
                            typedMessage += addedString;
                            setTypingState(prev => {
                                const newTypingState = new Map(prev);
                                const targetTypingState = newTypingState.get(target);
                                if (targetTypingState) {
                                    targetTypingState.typingOutput = [...currentMessages, typedMessage];
                                }
                                return newTypingState;
                            });
                            if (i > message.length - 1) {
                                clearInterval(typingInterval);
                                setTypingState(prev => {
                                    const newTypingState = new Map(prev);
                                    const targetTypingState = newTypingState.get(target);
                                    if (targetTypingState) {
                                        targetTypingState.isTyping = false;
                                    }
                                    return newTypingState;
                                });
                                resolve();
                            }
                        }, perMessage ? typingDuration : delay);
                    } else {
                        resolve();
                    }
                } else {
                    resolve();
                }
            }
        });
    };


    useEffect(() => {
        if (typingState && !typingState.get('inputRef')?.isTyping && !typingState.get('withSIDRef')?.isTyping && !typingState.get('withoutSIDRef')?.isTyping) {
            typeInTerminal(1000, true, 'inputRef').then(() => {
                typeInTerminal(2000, true, 'withSIDRef');
                typeInTerminal(2000, true, 'withoutSIDRef');
            });
        }
        return () => {
        };
    }, [typingState]);


    useEffect(() => {
        if (activeTemplate) {
            setTypingState(prev => {
                const newTypingState = new Map(prev);
                for (const [key, value] of Object.entries({
                    'inputRef': activeTemplate.input,
                    'withSIDRef': activeTemplate.outputWithSID,
                    'withoutSIDRef': activeTemplate.outputWithoutSID,
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
    }, [activeTemplate]);


    return (
        <div className={styles.mainWrapperCopyWriting}>
            <div className={styles.taskContainer}>
                <div className={styles.taskHeader}>
                    <span className={styles.taskText}>Task:</span>
                    <input className={styles.taskTextBox}
                           placeholder={'Write a twitter thread about SID...'}
                           ref={typingState ? typingState.get('inputRef')?.typingRef as unknown as React.RefObject<HTMLInputElement> : null}
                           disabled={true}
                           value={typingState ? typingState.get('inputRef')?.typingOutput.map((message) => {
                               return message;
                           }).join('') : ''}
                    />
                </div>
                <div className={styles.taskBody}>
                    {templates.map((template, index) => {
                            return (
                                <button className={styles.taskTemplate}
                                        onClick={() => {
                                            setActiveTemplate(template);
                                        }}
                                        key={index}
                                >
                                    <span style={{backgroundImage: template.backgroundImage}}/>
                                    <span>{template.buttonText}</span>
                                </button>
                            );
                        }
                    )}
                </div>
            </div>
            <div className={styles.textEditorContainer}>
                <div className={styles.textEditorHeader}
                     style={{backgroundImage: 'url(/static/images/text-editor-dummy-menu.svg)'}}>
                </div>
                <div className={styles.textEditorBody}>
                    <div className={styles.textEditorWithSID}>
                        <h4>Text Generation <span> with SID</span></h4>
                        <p ref={typingState ? typingState.get('withSIDRef')?.typingRef as unknown as React.RefObject<HTMLInputElement> : null}>{typingState ? typingState.get('withSIDRef')?.typingOutput.map((message) => {
                            return (
                                <>{message}</>
                            );
                        }) : ''}
                            <span className={styles.cursor}/>
                        </p>
                    </div>
                    <div className={styles.textEditorWithoutSID}>
                        <h4>Text Generation <span> without SID</span></h4>
                        <p ref={typingState ? typingState.get('withoutSIDRef')?.typingRef as unknown as React.RefObject<HTMLInputElement> : null}>{typingState ? typingState.get('withoutSIDRef')?.typingOutput.map((message) => {
                            return (
                                <>{message}</>
                            );
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
