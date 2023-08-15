import React from 'react';
import styles from "@/styles/Agents.module.scss";
import {DemoProps} from "@/types";

export default function Agents({template}: DemoProps) {
    return (
        <div className={styles.mainWrapperAgents}>
            <img src="/static/images/rocket.svg" alt="Agents" className={styles.agentsImage}/>
            <div>Launching Soon</div>
        </div>
    );
}