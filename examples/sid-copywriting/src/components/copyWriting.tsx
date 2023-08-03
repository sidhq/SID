import React, {ChangeEvent, useEffect, useState} from 'react';
import styles from "@/styles/CopyWriting.module.scss";

interface Template {
    input: string;
    outputWithSID: string;
    outputWithoutSID: string;
}

export default function CopyWriting() {
    const [messages, setMessages] = useState<String[]>([]);
    const [cursorIsTyping, setCursorIsTyping] = useState<boolean>(false);  // State for typing indicator in terminal
    const [userInput, setUserInput] = useState<string | null>(null);  // State for user input in terminal
    const [cursorTypingQueue, setCursorTypingQueue] = useState<String[]>([]);  // queue for messages in terminal
    const [activeTemplate, setActiveTemplate] = useState<Template | null>(null);  // queue for messages in terminal


    const templates = [{
        buttonText: 'Twitter Thread',
        backgroundImage: 'url(/static/images/bird.svg)',
        input: 'Write a twitter thread about SID...',
        outputWithSID: 'SID is a new AI that can write tweets for you. It is trained on millions of tweets and can generate tweets that are indistinguishable from human-written tweets. SID is a new AI that can write tweets for you. It is trained on millions of tweets and can generate tweets that are indistinguishable from human-written tweets. SID is a new AI that can write tweets for you. It is trained on millions of tweets and can generate tweets that are indistinguishable from human-written tweets. SID is a new AI that can write tweets for you. It is trained on millions of tweets and can generate tweets that are indistinguishable from human-written tweets.',
        outputWithoutSID: 'SID is a new AI that can write tweets for you. It is trained on millions of tweets and can generate tweets that are indistinguishable from human-written tweets. SID is a new AI that can write tweets for you. It is trained on millions of tweets and can generate tweets that are indistinguishable from human-written tweets. SID is a new AI that can write tweets for you. It is trained on millions of tweets and can generate tweets that are indistinguishable from human-written tweets. SID is a new AI that can write tweets for you. It is trained on millions of tweets and can generate tweets that are indistinguishable from human-written tweets.',
    }, {
        buttonText: 'Sales Outreach',
        backgroundImage: 'url(/static/images/handshake.svg)',
        input: 'Write a sales outreach email to a potential customer...',
        outputWithSID: 'SID is a new AI that can write sales outreach emails for you. It is trained on millions of sales outreach emails and can generate emails that are indistinguishable from human-written emails. SID is a new AI that can write sales outreach emails for you. It is trained on millions of sales outreach emails and can generate emails that are indistinguishable from human-written emails. SID is a new AI that can write sales outreach emails for you. It is trained on millions of sales outreach emails and can generate emails that are indistinguishable from human-written emails. SID is a new AI that can write sales outreach emails for you. It is trained on millions of sales outreach emails and can generate emails that are indistinguishable from human-written emails.',
        outputWithoutSID: 'SID is a new AI that can write sales outreach emails for you. It is trained on millions of sales outreach emails and can generate emails that are indistinguishable from human-written emails. SID is a new AI that can write sales outreach emails for you. It is trained on millions of sales outreach emails and can generate emails that are indistinguishable from human-written emails. SID is a new AI that can write sales outreach emails for you. It is trained on millions of sales outreach emails and can generate emails that are indistinguishable from human-written emails. SID is a new AI that can write sales outreach emails for you. It is trained on millions of sales outreach emails and can generate emails that are indistinguishable from human-written emails.',
    }, {
        buttonText: 'Customer Support Email',
        backgroundImage: 'url(/static/images/mail.svg)',
        input: 'Write a customer support email to a customer...',
        outputWithSID: 'SID is a new AI that can write customer support emails for you. It is trained on millions of customer support emails and can generate emails that are indistinguishable from human-written emails. SID is a new AI that can write customer support emails for you. It is trained on millions of customer support emails and can generate emails that are indistinguishable from human-written emails. SID is a new AI that can write customer support emails for you. It is trained on millions of customer support emails and can generate emails that are indistinguishable from human-written emails. SID is a new AI that can write customer support emails for you. It is trained on millions of customer support emails and can generate emails that are indistinguishable from human-written emails.',
        outputWithoutSID: 'SID is a new AI that can write customer support emails for you. It is trained on millions of customer support emails and can generate emails that are indistinguishable from human-written emails. SID is a new AI that can write customer support emails for you. It is trained on millions of customer support emails and can generate emails that are indistinguishable from human-written emails. SID is a new AI that can write customer support emails for you. It is trained on millions of customer support emails and can generate emails that are indistinguishable from human-written emails. SID is a new AI that can write customer support emails for you. It is trained on millions of customer support emails and can generate emails that are indistinguishable from human-written emails.',
    }, {
        buttonText: 'Launch Presentation',
        backgroundImage: 'url(/static/images/stocks.svg)',
        input: 'Write a presentation for the launch of SID...',
        outputWithSID: 'SID is a new AI that can write presentations for you. It is trained on millions of presentations and can generate presentations that are indistinguishable from human-written presentations. SID is a new AI that can write presentations for you. It is trained on millions of presentations and can generate presentations that are indistinguishable from human-written presentations. SID is a new AI that can write presentations for you. It is trained on millions of presentations and can generate presentations that are indistinguishable from human-written presentations. SID is a new AI that can write presentations for you. It is trained on millions of presentations and can generate presentations that are indistinguishable from human-written presentations.',
        outputWithoutSID: 'SID is a new AI that can write presentations for you. It is trained on millions of presentations and can generate presentations that are indistinguishable from human-written presentations. SID is a new AI that can write presentations for you. It is trained on millions of presentations and can generate presentations that are indistinguishable from human-written presentations. SID is a new AI that can write presentations for you. It is trained on millions of presentations and can generate presentations that are indistinguishable from human-written presentations. SID is a new AI that can write presentations for you. It is trained on millions of presentations and can generate presentations that are indistinguishable from human-written presentations.',
    }, {
        buttonText: 'Other Examples',
        backgroundImage: 'url(/static/images/rocket-ship.svg)',
        input: 'Write a...',
        outputWithSID: 'SID is a new AI that can write for you. It is trained on millions of documents and can generate documents that are indistinguishable from human-written documents. SID is a new AI that can write for you. It is trained on millions of documents and can generate documents that are indistinguishable from human-written documents. SID is a new AI that can write for you. It is trained on millions of documents and can generate documents that are indistinguishable from human-written documents. SID is a new AI that can write for you. It is trained on millions of documents and can generate documents that are indistinguishable from human-written documents.',
        outputWithoutSID: 'SID is a new AI that can write for you. It is trained on millions of documents and can generate documents that are indistinguishable from human-written documents. SID is a new AI that can write for you. It is trained on millions of documents and can generate documents that are indistinguishable from human-written documents. SID is a new AI that can write for you. It is trained on millions of documents and can generate documents that are indistinguishable from human-written documents. SID is a new AI that can write for you. It is trained on millions of documents and can generate documents that are indistinguishable from human-written documents.',
    }];

    const typeInTerminal = (delay: number, perMessage: boolean) => {
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
                setMessages([typedMessage]);
                if (i > message.length - 1) {
                    clearInterval(typingInterval);
                    setCursorIsTyping(false);
                }
            }, perMessage ? typingDuration : delay);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            setUserInput(e.currentTarget.value);
        }
    };


    useEffect(() => {
        //if new user input
        if (activeTemplate) {
            //add user input to message queue
            setCursorTypingQueue([activeTemplate.outputWithSID]);
        }

        //start typingEngine if it is not already running
        if (!cursorIsTyping) {
            //typeInTerminal(2000, true);   //2000=delay per message
            typeInTerminal(32, false);   //25=delay per character
        }
    }, [cursorTypingQueue, activeTemplate]);

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
                        <p>{messages[0]}
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
