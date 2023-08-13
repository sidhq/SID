import styles from '@/styles/Home.module.scss'
import CopyWriting from "@/components/copyWriting";
import EmailWriting from "@/components/emailWriting";
import Chat from "@/components/chat";
import {Template, TemplateType} from "@/types";
import React, {useEffect, useState} from "react";



export default function Home() {
    useEffect(() => {
        let container = document.body; // Access the iframe's body directly
        let watcher: any;
        let lastScrollHeight: number = container.scrollHeight;

        const watch = () => {
            cancelAnimationFrame(watcher);

            if (lastScrollHeight !== container.scrollHeight) {
                if(window.parent?.resizeIframeToContentSize){
                    window.parent?.resizeIframeToContentSize(document.documentElement);
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

    const templates: Template[] = [{
        buttonText: 'Twitter Post',
        type: TemplateType.text,
        backgroundImage: 'url(/static/images/twitter.svg)',
        input: 'Write a Twitter post explaining what SID does',
        outputWithSID: 'Struggling with making your AI app more context-aware? SID <mark class="mark-blue" data-tooltip="Another cool tooltip">simplifies the integration of customer data</mark>. Our API seamlessly handles all - data integrations, storage, and retrieval. We save you months of engineering effort <mark class="mark-red" data-tooltip="hi there">in a single afternoon</mark>.',
        outputWithoutSID: 'SID (System Identification) is a powerful technique used in engineering to <mark  class="mark-blue" data-tooltip="Wow, tooltips are great!!!">model and analyze dynamic systems</mark>. It helps us understand and predict the behavior of complex systems, enabling us to <mark class="mark-purple" data-tooltip="Wow, tooltips are great!!!">design efficient control strategies</mark>.',
    }, {
        buttonText: 'Sales Outreach',
        type: TemplateType.mail,
        backgroundImage: 'url(/static/images/mail.svg)',
        input: 'Write 3 sentences explaining why the copywriting AI company {companyName} could use SID. Use an example of how linking mail and knowledge bases can help their product.',
        outputWithSID: 'SID\'s API simplifies the integration of user data into AI applications. For example, {companyName} could get detailed context on each user\'s prompt by enabling them to link their knowledge base and email history. This allows {companyName} generate more tailored, precise and effective copy.',
        outputWithoutSID: 'Using Sentence Intent Detection (SID), {companyName}, can generate more relevant and targeted content by understanding the intent behind each sentence. For example, when creating emails, SID can discern whether the user wants to inform, persuade, or inquire. Whether creating knowledge bases or generating emails, SID ensures that {companyName} content is accurate and aligned with the user\s intent.',
    }, {
        buttonText: 'Random Quote',
        type: TemplateType.chat,
        backgroundImage: 'url(/static/images/brain.svg)',
        input: 'What did {name} say about benchmarking?',
        outputWithSID: '{name} said that benchmarks are sometimes overrated and that testing on real user feedback can be more reliable. {name} mentioned that relying too much on benchmarks can lead to tuning solely for those benchmarks rather than focusing on the actual performance and quality of the product.',
        outputWithoutSID: 'I\'m sorry, but as an AI, I don\'t have access to specific databases or personal data unless it has been shared with me in the course of our conversation. Therefore, I don\'t have any specific information about what {name} said about benchmarking. However, I can provide general information about benchmarking.',
    }, {
        buttonText: 'Personal Mail',
        type: TemplateType.mail,
        backgroundImage: 'url(/static/images/handshake.svg)',
        input: 'Write a casual first sentence for an email to {name} that highlights our uncommon commonalities',
        outputWithSID: 'I hope this email finds you well amidst the {city} startup hustle! As fellow {university} alumni, it\'s amusing to discover that we\'ve both mastered the art of balancing business acumen with coding finesse – who would\'ve thought?',
        outputWithoutSID: 'Isn\'t it wild how we both seem to march to the beat of the same offbeat drum, sharing some pretty uncommon commonalities?',
    }, {
        buttonText: 'Feature Presentation',
        type: TemplateType.text,
        backgroundImage: 'url(/static/images/stocks.svg)',
        input: 'What features would make SID\'s product better?',
        outputWithSID: 'Feature 1: Expanded Data Source Integration: Adding support for more data sources like Dropbox, Slack, or CRM platforms would allow SID to access a wider range of user data, enabling more comprehensive and personalized AI services. Feature 2. Advanced NLP Capabilities: Enhancing SID\'s NLP capabilities could involve improving sentiment analysis and entity recognition. This would enable a more accurate and nuanced understanding of user data and generate more context-aware responses.',
        outputWithoutSID: 'I\'m sorry, but I don\'t have information about a specific project or product called "SID" in my training data up until September 2021. Could you please provide more context or details about what "SID" refers to? That way, I can try to offer suggestions on how to improve it.',
    }, {
        buttonText: 'Travel Plans',
        type: TemplateType.chat,
        backgroundImage: 'url(/static/images/mountain.svg)',
        input: 'Give me an overview of what we\'ve decided on for Iceland',
        outputWithSID: 'The trip will take place from {date} to {date}. {name} will arrive at {time} and will have some time to entertain themselves in {city} until you and {name} arrive around {time}. The first two days will be spent driving along the south coast, while the remaining three days will be spent in {city}. {name} will contact a guide to inquire about the possibility of hiking to an active volcano on {date}.',
        outputWithoutSID: 'I\'m sorry, but I don\'t have access to previous conversations or decisions made regarding Iceland. As an AI language model, I don\'t have the capability to retain information from previous interactions. If you have any specific questions, feel free to ask, and I\'ll do my best to help you.'
    }];

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

        </div>
    )
}
