import styles from '@/styles/Home.module.scss'
import CopyWriting from "@/components/copyWriting";
import EmailWriting from "@/components/emailWriting";
import Chat from "@/components/chat";
import Agents from "@/components/agents";
import {Template, TemplateType} from "@/types";
import React, {useEffect, useState} from "react";

interface MyWindow extends Window {
    resizeIframeToContentSize?: (element: HTMLElement) => void;
}

export default function Home() {
    useEffect(() => {
        let container = document.body; // Access the iframe's body directly
        let watcher: any;
        let lastScrollHeight: number = container.scrollHeight;

        const watch = () => {
            cancelAnimationFrame(watcher);

            if (lastScrollHeight !== container.scrollHeight) {
                const myWindowParent = window.parent as MyWindow;
                if(myWindowParent?.resizeIframeToContentSize){
                    myWindowParent?.resizeIframeToContentSize(document.documentElement);
                }
            }
            lastScrollHeight = container.scrollHeight;
            watcher = requestAnimationFrame(watch);
        };

        watcher = window.requestAnimationFrame(watch);

        return () => {
            // Cleanup: Cancel the animation frame request when the component is unmounted
            cancelAnimationFrame(watcher);
        };
    }, []);

    const templates: Template[] = [
        {
            buttonText: 'Copywriting',
            type: TemplateType.text,
            backgroundImage: 'url(/static/images/copywriting.svg)',
            input: 'Write a Twitter post explaining what SID does',
            outputWithSID: 'Struggling to add live data to make your AI apps more personal? SID makes <mark class="mark-2">adding customer data to AI apps easy</mark>. Their API seamlessly handles data integrations, storage, and retrieval. Do in an afternoon what would usually take months.',
            outputWithoutSID: 'SID (System Identification) is a technique used in engineering to <mark class="mark-2">model and analyze dynamic systems</mark>. It helps us understand and predict the behavior of complex systems, enabling us to design efficient control strategies.',
        },{
            buttonText: 'Sales Automation',
            type: TemplateType.mail,
            backgroundImage: 'url(/static/images/mail.svg)',
            input: 'Explain why the AI copywriting company Jasper could need SID. Use an example.',
            outputWithSID: 'SID\'s API simplifies the <mark class="mark-2">integration of user data into AI applications</mark>. For example, Jasper could <mark class="mark-1">get detailed context on each user</mark>\'s prompt by enabling them to link their knowledge base and email history. This allows Jasper generate <mark class="mark-1" >more tailored, precise and effective copy</mark>.',
            outputWithoutSID: 'Using  <mark class="mark-2" >Sentence Intent Detection (SID) </mark>, Jasper, can generate more relevant and targeted content by understanding the intent behind each sentence. For example, when creating emails, SID can discern whether the user wants to inform, persuade, or inquire.'
        },{
            buttonText:'Long-term LLM Memory',
            type: TemplateType.chat,
            backgroundImage: 'url(/static/images/brain.svg)',
            input: 'Give me an overview of what we\'ve decided on for Iceland',
            outputWithSID: 'The trip will take place from 09/22 to 09/28. Scott will arrive at 7am and will have some time to entertain themselves in Reykjavik until you arrive around 3pm. The first two days will be spent driving along the south coast, while the remaining three will be spent in Arnarstapi.',
            outputWithoutSID: 'I\'m sorry, but I don\'t have access to previous conversations regarding Iceland. As an AI language model, I don\'t have the capability to retain information from previous interactions. If you have any specific questions, feel free to ask, and I\'ll do my best to help you.'
        },{
            buttonText: 'Question Answering',
            type: TemplateType.chat,
            backgroundImage: 'url(/static/images/question.svg)',
            input: 'What did Jeff say about benchmarking',
            outputWithSID: 'Jeff said that benchmarks are sometimes overrated and that testing on real user feedback can be more reliable. He mentioned that relying too much on benchmarks can lead to tuning solely for those benchmarks rather than focusing on the actual performance and quality of the product.',
            outputWithoutSID: 'I\'m sorry, but as an AI, I don\'t have access to specific databases or personal data. Therefore, I don\'t have any specific information about what Jeff said about benchmarking.',
        },{
            buttonText: 'Presentation',
            type: TemplateType.text,
            backgroundImage: 'url(/static/images/presentation.svg)',
            input: 'What features would make SID\'s product better?',
            outputWithSID: '<mark class="mark-2">More Data Sources</mark>: Adding support for more data sources like Dropbox or CRM platforms would allow SID to access a wider range of user data.<br> <mark class="mark-2" >Additional NLP Capabilities</mark>: Enhancing SID\'s NLP capabilities could involve improving entity recognition.',
            outputWithoutSID: 'I\'m sorry, but I <mark class="mark-2" >don\'t have information</mark> about a specific project or product called "SID" in my <mark class="mark-2">training data up until September 2021</mark>. Could you please provide more context or details about what "SID" refers to? That way, I can try to offer suggestions on how to improve it.'
        },{
            buttonText:'Agents',
            type: TemplateType.agent,
            backgroundImage: 'url(/static/images/robot.svg)',
            input: 'Give me an overview of what we\'ve decided on for Iceland',
            outputWithSID: 'The trip will take place from 09/22 to 09/28. Scott will arrive at 7am and will have some time to entertain themselves in Reykjavik until you arrive around 3pm. The first two days will be spent driving along the south coast, while the remaining three will be spent in Arnarstapi.',
            outputWithoutSID: 'I\'m sorry, but I don\'t have access to previous conversations regarding Iceland. As an AI language model, I don\'t have the capability to retain information from previous interactions. If you have any specific questions, feel free to ask, and I\'ll do my best to help you.'
        }
        ];

    const [activeTemplate, setActiveTemplate] = useState<Template | null>(templates[0]);  // queue for messages in terminal

    return (
        <div className={styles.mainWrapper}>
            <div className={styles.taskContainer}>
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
            {activeTemplate?.type === TemplateType.text && (
                <CopyWriting template={activeTemplate}/>)}
            {activeTemplate?.type === TemplateType.mail && (
                <EmailWriting template={activeTemplate}/>)}
            {activeTemplate?.type === TemplateType.chat && (
                <Chat template={activeTemplate}/>)}
            {activeTemplate?.type === TemplateType.agent && (
                <Agents template={activeTemplate}/>)}
        </div>
    )
}
