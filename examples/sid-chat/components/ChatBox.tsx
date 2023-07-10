import React from "react";
import styles from '@/styles/ChatBox.module.scss';
import SidSVG from "@/components/SidSVG";

const ChatBox: React.FC = () => {
    return (
        <div className={styles.mainWrapper}>
            <div className={styles.headingWrapper}>
                <h3>ChatGPT</h3>
                <h3>ChatGPT + <SidSVG width={35} height={35} fill={'#F4E7D4'}/></h3>
            </div>
            <div className={styles.chatBoxWrapper}>
                <div className={styles.chatBoxLeft}></div>
                <div className={styles.chatBoxRight}></div>
            </div>
            <div className={styles.chatBoxInputWrapper}>
                <input className={styles.chatBoxInput} placeholder="Write a reply..."/>
                <button className={styles.chatBoxSendButton}>Send</button>
            </div>
        </div>
    );
}

export default ChatBox;