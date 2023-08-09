import {TypingState, SetTypingState} from "@/types";
export const typeInTerminal = async (delay: number, perMessage: boolean, target: string, typingState: TypingState, setTypingState:SetTypingState): Promise<void> => {
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