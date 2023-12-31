import React, {useEffect, useState} from 'react';
import styles from "@/styles/CopyWriting.module.scss";
import {TypingState, DemoProps} from "@/types";
import {typeInTerminal} from "@/utils";

enum SpinnerState {
    NONE, // No spinner or checkmark
    SPINNING, // Spinner is active
    CHECKMARK // Checkmark animation is active
}

export default function CopyWriting({template}: DemoProps) {
    const [spinnerState, setSpinnerState] = useState(SpinnerState.NONE);
    const [typingState, setTypingState] = useState<TypingState>(
        new Map([
            ['inputRef', {
                typingRef: React.createRef<HTMLDivElement>(),
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

    useEffect(() => {
        if (typingState && !typingState.get('inputRef')?.isTyping && !typingState.get('withSIDRef')?.isTyping && !typingState.get('withoutSIDRef')?.isTyping) {
            console.log('typingState', typingState.get('inputRef')?.typingQueue);
            typeInTerminal(500, true, 'inputRef', typingState, setTypingState)
                .then(() => {
                    setTypingState(prev => {
                        const newTypingState = new Map(prev);
                        const inputRefObj = newTypingState.get('inputRef');
                        if (inputRefObj) {
                            inputRefObj.typingQueue.length = 0;
                            newTypingState.set('inputRef', inputRefObj);
                        }
                        return newTypingState;
                    });
                    setSpinnerState(SpinnerState.SPINNING);

                    setTimeout(() => {
                        setSpinnerState(SpinnerState.CHECKMARK);
                        // Start the next typeInTerminal functions
                        typeInTerminal(15, false, 'withSIDRef', typingState, setTypingState)
                            .catch((err) => {
                                console.log(err);
                            });

                        typeInTerminal(20, false, 'withoutSIDRef', typingState, setTypingState)
                            .catch((err) => {
                                console.log(err);
                            });
                    }, 500);
                })
                .catch((err) => {
                    console.log(err);
                });
        }
        return () => {
        };
    }, [typingState]);

    useEffect(() => {
        setSpinnerState(SpinnerState.NONE);
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
        <div className={styles.mainWrapperCopyWriting}>
            <div className={styles.taskContainer}>
                <label className={styles.taskText}>Task:</label>
                <div className={styles.taskTextBox}
                     placeholder={'Select an example to see SID in action!'}
                     ref={typingState ? typingState.get('inputRef')?.typingRef as unknown as React.RefObject<HTMLDivElement> : null}
                >{typingState ? typingState.get('inputRef')?.typingOutput.map((message, index) => {
                    return (<p key={`copy_input${index}`} dangerouslySetInnerHTML={{__html: message}}/>);
                }) : ''}
                </div>
            </div>
            <div className={styles.spinnerContainer}
                 style={{display: spinnerState !== SpinnerState.NONE ? 'flex' : 'none'}}>
                <div className={`${styles.spinning} ${styles.spinnerInner}`}
                     style={{display: spinnerState == SpinnerState.SPINNING ? 'flex' : 'none'}}>
                    <div className={styles.spinnerCenter}>
                        {Array.from(Array(12).keys()).map((_, index) => {
                            return (<div key={`spinner_${index}`}/>);
                        })}
                    </div>
                    <p>Requesting context using SID&apos;s API...</p>
                </div>
                <div className={`${styles.checkmark} ${styles.spinnerInner}`}
                     style={{display: spinnerState == SpinnerState.CHECKMARK ? 'flex' : 'none'}}>
                    <svg viewBox="0 0 100 100">
                        <path d="M 20.973 50.487 L 43.27 75.048 L 94.305 23.366" className={styles.checkmarkSVG}/>
                    </svg>
                    <p>Context received from SID&apos;s API.</p>
                </div>
            </div>
            <div className={styles.textEditorContainer} style={{display: spinnerState == SpinnerState.CHECKMARK ? '' : 'none'}}>
                <div className={styles.textEditorHeader}
                     style={{backgroundImage: 'url(/static/images/text-editor-fake-menu.svg)'}}>
                </div>
                <div className={styles.textEditorBody} >
                    <div className={styles.textEditorWithSID}>
                        <h4>Text Generation <span> with SID</span></h4>
                        <p ref={typingState ? typingState.get('withSIDRef')?.typingRef as unknown as React.RefObject<HTMLInputElement> : null}>{typingState ? typingState.get('withSIDRef')?.typingOutput.map((message, index) => {
                            return (<span key={`copy_with_sid_${index}`} dangerouslySetInnerHTML={{__html: message}}/>);
                        }) : ''}
                            <span className={styles.cursor} style={{display: spinnerState == SpinnerState.CHECKMARK ? '' : 'none'}}/>
                        </p>
                    </div>
                    <div className={styles.textEditorWithoutSID}>
                        <h4>Text Generation <span> without SID</span></h4>
                        <p ref={typingState ? typingState.get('withoutSIDRef')?.typingRef as unknown as React.RefObject<HTMLInputElement> : null}>{typingState ? typingState.get('withoutSIDRef')?.typingOutput.map((message, index) => {
                            return (
                                <span key={`copy_without_sid_${index}`} dangerouslySetInnerHTML={{__html: message}}/>);
                        }) : ''}
                            <span className={styles.cursor} style={{display: spinnerState == SpinnerState.CHECKMARK ? '' : 'none'}}/>
                        </p>
                    </div>
                </div>
            </div>
            {/*<div className={styles.sneakBehindTheCurtainContainer}>
                <button>Sneak behind the curtain</button>
            </div>*/}
        </div>
    );
}
