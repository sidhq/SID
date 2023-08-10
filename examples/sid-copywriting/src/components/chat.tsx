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

        </div>
    );

}