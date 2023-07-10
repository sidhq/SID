import React from "react";
import styles from '@/styles/ChatBox.module.scss';
import SidSVG from "@/components/SidSVG";
import ChatMessage from "@/components/ChatMessage";

const ChatBox: React.FC = () => {
    return (
        <div className={styles.mainWrapper}>
            <div className={styles.headingWrapper}>
                <h3>ChatGPT</h3>
                <h3>ChatGPT + <SidSVG width={35} height={35} fill={'#F4E7D4'}/></h3>
            </div>
            <div className={styles.chatBoxWrapper}>
                <div className={styles.chatBoxLeft}>
                    <ChatMessage isAIMessage={true} content={'Hi, I am ChatGPT! How can I help you today?'}/>
                    <ChatMessage isAIMessage={false} content={'Hi ChatGPT, can you pull up my personal files? I\'d like to go over them.'}/>
                    <ChatMessage isAIMessage={true} content={'I\'m sorry for the confusion, Max, but as an AI, I don\'t have access to personal data about individuals unless it has been shared with me in the course of our conversation. I am designed to respect user privacy and confidentiality. My primary function is to provide information and answer questions to the best of my knowledge and abilities. Can I assist you with information or answer any questions in another way?'}/>
                    <ChatMessage isAIMessage={false} content={'Okay, I understand. But can you access any of my previous chats or retrieve data from my previous conversations?'}/>
                    <ChatMessage isAIMessage={true} content={'I must clarify that I don\'t have the capability to remember or retrieve personal data from past interactions. My design is rooted in privacy and confidentiality principles, ensuring that I don\'t store personal conversation data. Each conversation with me doesn\'t have a memory; I don\'t keep track of users or their data. Is there anything else you would like to know or discuss?'}/>
                </div>
                <div className={styles.chatBoxRight}>
                    <ChatMessage isAIMessage={true} content={'Hi Max, my name is ChatGPT! How can I help you today?'}/>
                    <ChatMessage isAIMessage={false} content={'Hi ChatGPT, can you pull up my personal files? I\'d like to go over them.'}/>
                    <ChatMessage isAIMessage={true} content={'Of course, Max. Just to clarify, would you like to review your educational records, work history, or something else specific?'}/>
                    <ChatMessage isAIMessage={false} content={'Hmm, can we go over my work history?'}/>
                    <ChatMessage isAIMessage={true} content={'Absolutely, Max. According to the files I have access to, you began your career as a Software Engineer at Contoso in 2018. You then moved on to Hooli Inc. as a Senior Software Engineer in 2021. As of now, you are working as a Project Lead at DEF Solutions, a position you\'ve held since 2022. Is there a specific period you\'d like to discuss more?'}/>
                    <ChatMessage isAIMessage={false} content={'Oh, can you recall any of my accomplishments from my current position?'}/>
                    <ChatMessage isAIMessage={true} content={'Certainly. At DEF Solutions, you led a team that developed a breakthrough application which significantly increased operational efficiency. You also received the "Employee of the Year" award in 2023 for your exceptional leadership and dedication to your team\'s success. How would you like to proceed from here?\n'}/>
                </div>
            </div>
            <div className={styles.chatBoxInputWrapper}>
                <input className={styles.chatBoxInput} placeholder="Write a reply..."/>
                <button className={styles.chatBoxSendButton}>Send</button>
            </div>
        </div>
    );
}

export default ChatBox;