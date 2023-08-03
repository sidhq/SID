import React, {ChangeEvent, useEffect, useState} from 'react';
import styles from "@/styles/CopyWriting.module.scss";


export default function CopyWriting() {
    const [messages, setMessages] = useState<String[]>([]);
    const [cursorIsTyping, setCursorIsTyping] = useState<boolean>(false);  // State for typing indicator in terminal
    const [userInput, setUserInput] = useState<string | null>(null);  // State for user input in terminal
    const [cursorTypingQueue, setCursorTypingQueue] = useState<String[]>([]);  // queue for messages in terminal

    const typeInTerminal = (delay: number) => {
        //while messages is not empty
        if (cursorTypingQueue.length > 0) {
            setCursorIsTyping(true);
            //set cursorIsTyping to true
            //get first message from messagesQueue
            const message = cursorTypingQueue[0];
            //remove first message from messagesQueue
            setCursorTypingQueue(prev => prev.slice(1));

            let i = 0;
            let typedMessage: string = '';
            const currentMessages = messages;
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
                let addedString = '';
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
                typedMessage += addedString;
                setMessages([...currentMessages, typedMessage]);
                if (i > message.length - 1) {
                    clearInterval(typingInterval);
                    setCursorIsTyping(false);
                }
            }, typingDuration);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
        }
    };


    useEffect(() => {
        //if new user input
        if (userInput) {
            //add user input to message queue
            setCursorTypingQueue(prev => [...prev, userInput]);
            //clear user input
            setUserInput(null);
        }

        //start typingEngine if it is not already running
        if (!cursorIsTyping) {
            typeInTerminal(2000);   //2000=delay per message
        }
    }, [userInput, cursorIsTyping]);


    useEffect(() => {
        setMessages(['Hi, I am ChatGPT! How can I help you today?']);
    }, []);


    return (
        <div className={styles.mainWrapperCopyWriting}>
            <div className={styles.taskContainer}>
                <div className={styles.taskHeader}>
                    <span className={styles.taskText}>Task:</span>
                    <input className={styles.taskTextBox}
                           placeholder={'Write a twitter thread about SID...'}
                           onKeyDown={handleKeyDown}
                    />
                </div>
                <div className={styles.taskBody}>
                    <button className={styles.taskTemplate}>
                        <span style={{backgroundImage: 'url(/static/images/bird.svg)'}}/>
                        <span>Twitter Thread</span>
                    </button>
                    <button className={styles.taskTemplate}>
                        <span style={{backgroundImage: 'url(/static/images/handshake.svg)'}}/>
                        <span>Sales Outreach</span>
                    </button>
                    <button className={styles.taskTemplate}>
                        <span style={{backgroundImage: 'url(/static/images/mail.svg)'}}/>
                        <span>Customer Support Mail</span>
                    </button>
                    <button className={styles.taskTemplate}>
                        <span style={{backgroundImage: 'url(/static/images/stocks.svg)'}}/>
                        <span>Launch Presentation</span>
                    </button>
                    <button className={styles.taskTemplate}>
                        <span style={{backgroundImage: 'url(/static/images/rocket-ship.svg)'}}/>
                        <span>Other Examples</span>
                    </button>
                </div>
            </div>
            <div className={styles.textEditorContainer}>
                <div className={styles.textEditorHeader}
                     style={{backgroundImage: 'url(/static/images/text-editor-dummy-menu.svg)'}}>
                </div>
                <div className={styles.textEditorBody}>
                    <div className={styles.textEditorWithSID}>
                        <h4>Text Generation <span> with SID</span></h4>
                        <p>Write a short description of your product, service, or idea. Then, click the button below to
                            generate a longer description.Write a short description of your product, service, or idea.
                            Then, click the button below to generate a longer description.Write a short description of
                            your product, service, or idea. Then, click the button below to generate a longer
                            description.Write a short description of your product, service, or idea. Then, click the
                            button below to generate a longer description.
                            <span className={styles.cursor}/>
                        </p>
                    </div>
                    <div className={styles.textEditorWithoutSID}>
                        <h4>Text Generation <span> without SID</span></h4>
                        <p>Write a short description of your product, service, or idea. Then, click the button below to
                            generate a longer description.
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
