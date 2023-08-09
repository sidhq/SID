import React, {ChangeEvent, useEffect, useState} from 'react';
import styles from "@/styles/CopyWriting.module.scss";
import {json} from "stream/consumers";

enum TemplateType {
    text,
    mail,
    chat
}

type Template = {
    buttonText: string,
    type: TemplateType,
    backgroundImage: string,
    input: string,
    outputWithSID: string,
    outputWithoutSID: string
};

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
        buttonText: 'Twitter Post',
        type: TemplateType.text,
        backgroundImage: 'url(/static/images/twitter.svg)',
        input: 'Write a Twitter post explaining what SID does',
        outputWithSID: 'Struggling with making your AI more context-aware? SID simplifies the integration of customer data. Our API seamlessly handles all data integrations, storage, and retrieval. We save you months of engineering effort in a single afternoon.',
        outputWithoutSID: 'SID (System Identification) is a powerful technique used in engineering to model and analyze dynamic systems. It helps us understand and predict the behavior of complex systems, enabling us to design efficient control strategies.',
    }, {
        buttonText: 'Sales Outreach',
        type: TemplateType.mail,
        backgroundImage: 'url(/static/images/mail.svg)',
        input: 'Write 3 sentences explaining why the copywriting AI company {companyName} could use SID. Use an example of how linking mail and knowledge bases can help their product.',
        outputWithSID: 'SID\'s API simplifies the integration of user data into AI applications. For example, {companyName} could get detailed context on each user\'s prompt by enabling them to link their knowledge base and email history. This allows {companyName} generate more tailored, precise and effective copy.',
        outputWithoutSID: 'Using Sentence Intent Detection (SID), {companyName}, can generate more relevant and targeted content by understanding the intent behind each sentence. For example, when creating emails, SID can discern whether the user wants to inform, persuade, or inquire. Whether creating knowledge bases or generating emails, SID ensures that {companyName} content is accurate and aligned with the user\s intent.',
    }, {
        buttonText: 'Random Quote',
        type: TemplateType.chat,
        backgroundImage: 'url(/static/images/brain.svg)',
        input: 'What did {name} say about benchmarking?',
        outputWithSID: '{name} said that benchmarks are sometimes overrated and that testing on real user feedback can be more reliable. {name} mentioned that relying too much on benchmarks can lead to tuning solely for those benchmarks rather than focusing on the actual performance and quality of the product.',
        outputWithoutSID: 'I\'m sorry, but as an AI, I don\'t have access to specific databases or personal data unless it has been shared with me in the course of our conversation. Therefore, I don\'t have any specific information about what {name} said about benchmarking. However, I can provide general information about benchmarking.',
    }, {
        buttonText: 'Personal Mail',
        type: TemplateType.mail,
        backgroundImage: 'url(/static/images/handshake.svg)',
        input: 'Write a casual first sentence for an email to {name} that highlights our uncommon commonalities',
        outputWithSID: 'I hope <b>this</b> email finds you well amidst the {city} startup hustle! As fellow {university} alumni, it\'s amusing to discover that we\'ve both mastered the art of balancing business acumen with coding finesse – who would\'ve thought? 😄',
        outputWithoutSID: 'Isn\'t it wild how we both seem to march to the beat of the same offbeat drum, sharing some pretty uncommon commonalities?',
    }, {
        buttonText: 'Feature Presentation',
        type: TemplateType.text,
        backgroundImage: 'url(/static/images/stocks.svg)',
        input: 'What features would make SID\'s product better?',
        outputWithSID: 'Feature 1: Expanded Data Source Integration: Adding support for more data sources like Dropbox, Slack, or CRM platforms would allow SID to access a wider range of user data, enabling more comprehensive and personalized AI services. Feature 2. Advanced NLP Capabilities: Enhancing SID\'s NLP capabilities could involve improving sentiment analysis and entity recognition. This would enable a more accurate and nuanced understanding of user data and generate more context-aware responses.',
        outputWithoutSID: 'I\'m sorry, but I don\'t have information about a specific project or product called "SID" in my training data up until September 2021. Could you please provide more context or details about what "SID" refers to? That way, I can try to offer suggestions on how to improve it.',
    }, {
        buttonText: 'Travel Plans',
        type: TemplateType.chat,
        backgroundImage: 'url(/static/images/mountain.svg)',
        input: 'Give me an overview of what we\'ve decided on for Iceland',
        outputWithSID: 'The trip will take place from {date} to {date}. {name} will arrive at {time} and will have some time to entertain themselves in {city} until you and {name} arrive around {time}. The first two days will be spent driving along the south coast, while the remaining three days will be spent in {city}. {name} will contact a guide to inquire about the possibility of hiking to an active volcano on {date}.',
        outputWithoutSID: 'I\'m sorry, but I don\'t have access to previous conversations or decisions made regarding Iceland. As an AI language model, I don\'t have the capability to retain information from previous interactions. If you have any specific questions, feel free to ask, and I\'ll do my best to help you.'
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
                    <div className={styles.taskText}>Task:</div>
                    <input className={styles.taskTextBox}
                           placeholder={'Select an example to see SID in action!'}
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
                            return (<span dangerouslySetInnerHTML={{__html: message}}/>);
                        }) : ''}
                            <span className={styles.cursor}/>
                        </p>
                    </div>
                    <div className={styles.textEditorWithoutSID}>
                        <h4>Text Generation <span> without SID</span></h4>
                        <p ref={typingState ? typingState.get('withoutSIDRef')?.typingRef as unknown as React.RefObject<HTMLInputElement> : null}>{typingState ? typingState.get('withoutSIDRef')?.typingOutput.map((message) => {
                            return (<span dangerouslySetInnerHTML={{__html: message}}/>);
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
