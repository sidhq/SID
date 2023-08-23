import React from 'react';
import styles from "@/styles/Agents.module.scss";
import {DemoProps} from "@/types";

export default function Agents({template}: DemoProps) {
    return (
        <div className={styles.mainWrapperAgents}>
            <div>
                <p>Check out
                    <a className={styles.agentGPTLogo} href={'https://agentgpt.reworkd.ai/'} target={"_parent"}>
                        <img src="/static/images/reworkd-logo.svg" alt="Agents" className={styles.agentsImage}/>
                        <span className={styles.agentSpan}>Agent</span><span className={styles.gptSpan}>GPT</span>
                    </a>to see SID in action!</p></div>
        </div>
    );
}