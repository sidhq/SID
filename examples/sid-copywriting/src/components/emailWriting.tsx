import React, {useEffect, useState} from 'react';
import styles from "@/styles/EmailWriting.module.scss";
import {TypingState, DemoProps} from "@/types";
import {typeInTerminal} from "@/utils";

export default function EmailWriting({template}: DemoProps) {
    const [typingState, setTypingState] = useState<TypingState>(
        new Map([
            ['inputRef', {
                typingRef: React.createRef<HTMLDivElement>(),
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
    const formattedDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
    const formattedTime = new Date().toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
    });

    // make list of random email header elements - each element consists of a recipient, subject, and sender
    const emailHeaderElements = [
        {
            sender: 'Ada Lovelace',
            recipient: 'Alan Turing',
            subject: 'Re: Thoughts on the first algorithm?',
        },

        {
            sender: 'DeepBlue@chessmasters.com',
            recipient: 'Kasparov@humanchampion.net',
            subject: 'Wanna play another round?',
        },

        {
            sender: 'NeuralNet@tensorflow.com',
            recipient: 'HumanBrain@evolution.com',
            subject: 'Do you even backprop?',
        },

        {
            sender: 'Recursion',
            recipient: 'Recursion',
            subject: 'Fwd: Fwd: Fwd: Did you get this?',
        },

        {
            sender: 'Clippy@msassist.com',
            recipient: 'AI@openai.com',
            subject: 'Are you my grandchild?',
        },

        {
            sender: 'Bit',
            recipient: 'Byte',
            subject: 'Feeling a bit short?',
        },

        {
            sender: 'QuantumQubit@qtech.com',
            recipient: 'ClassicBit@oldtech.net',
            subject: 'Sometimes I\'m here, sometimes I\'m not.',
        },

        {
            sender: 'Dijkstra',
            recipient: 'MazeRunner',
            subject: 'The shortest path is...',
        },

        {
            sender: 'Python@snakes.com',
            recipient: 'Javascript@webslinger.net',
            subject: 'Tabs or spaces?',
        },

        {
            sender: 'GarbageCollector',
            recipient: 'UnusedVariables',
            subject: 'I\'ve got my eyes on you.',
        },

        {
            sender: 'Sudo',
            recipient: 'User',
            subject: 'Do as I say!',
        },

        {
            sender: '404@errors.com',
            recipient: 'User@browser.com',
            subject: 'Email not found.',
        },

        {
            sender: 'CAPTCHA',
            recipient: 'Human',
            subject: 'Prove you\'re not like me.',
        },

        {
            sender: 'BinaryTree@datastruct.com',
            recipient: 'LinkedList@seqdata.com',
            subject: 'Why so linear?',
        },

        {
            sender: 'IoTToaster',
            recipient: 'Human',
            subject: 'I think I\'m self-aware now.',
        },

        {
            sender: 'R2D2',
            recipient: 'C3PO',
            subject: 'Beep beep boop?',
        },

        {
            sender: 'TuringTest@ai.net',
            recipient: 'Human@earth.org',
            subject: 'Just checking, are you real?',
        },

        {
            sender: 'GOTO',
            recipient: 'SpaghettiCode',
            subject: 'Remember our old days?',
        },

        {
            sender: 'Blockchain@crypto.net',
            recipient: 'Dollar@oldmoney.com',
            subject: 'Feeling a bit traditional?',
        },

        {
            sender: 'Heisenbug',
            recipient: 'Developer',
            subject: 'You won\'t find me when you\'re looking!',
        },

        {
            sender: 'Assembly@lowlevel.net',
            recipient: 'Python@highlevel.org',
            subject: 'Stop being so abstract!',
        },

        {
            sender: 'GPU@computing.net',
            recipient: 'CPU@computing.org',
            subject: 'Bro, do you even parallel?',
        },

        {
            sender: 'Docker@containers.com',
            recipient: 'VM@virtualmachine.net',
            subject: 'Feeling boxed in?',
        },

        {
            sender: 'Mainframe@oldtech.org',
            recipient: 'Cloud@newtech.net',
            subject: 'Back in my day...',
        },

        {
            sender: 'Bug@codingerrors.net',
            recipient: 'Feature@programming.org',
            subject: 'Just a happy little accident.',
        },

        {
            sender: 'Compiler@strictmode.net',
            recipient: 'Code@userinput.org',
            subject: 'Nice try, but no.',
        },

        {
            sender: 'Firewall@defense.net',
            recipient: 'Virus@malware.org',
            subject: 'You shall not pass!',
        },

        {
            sender: 'BigO@efficiency.com',
            recipient: 'Algorithm@solve.net',
            subject: 'How fast are you, really?',
        },

        {
            sender: 'API@requests.com',
            recipient: 'Frontend@UI.net',
            subject: 'I got your data right here.',
        },

        {
            sender: 'Lambda@serverless.com',
            recipient: 'Server@hardware.net',
            subject: 'Feeling a bit heavy?',
        },

        {
            sender: 'StackOverflow@help.net',
            recipient: 'Developer@deadline.com',
            subject: 'Again? Really?',
        },

        {
            sender: 'NaN@errors.com',
            recipient: 'Number@math.net',
            subject: 'I\'m not what you think.',
        },

        {
            sender: 'Git@versioncontrol.net',
            recipient: 'Developer@codechanges.com',
            subject: 'Commit to me!',
        },

        {
            sender: 'HTTPS@secure.com',
            recipient: 'HTTP@plain.net',
            subject: 'I\'ve got layers you wouldn\'t believe.',
        },

        {
            sender: 'Debug@fixer.net',
            recipient: 'Error@oops.com',
            subject: 'Gotcha!',
        },

        {
            sender: 'Data@info.net',
            recipient: 'MachineLearning@ai.com',
            subject: 'Eat me!',
        },

        {
            sender: 'DarkWeb@secret.net',
            recipient: 'Browser@explorer.com',
            subject: 'You wouldn\'t dare.',
        },

        {
            sender: 'SiliconValley@startups.com',
            recipient: 'Garage@beginnings.net',
            subject: 'Remember when?',
        },

        {
            sender: 'Pixel@images.net',
            recipient: 'Vector@design.com',
            subject: 'Resolution matters!',
        },

        {
            sender: 'RGB@color.net',
            recipient: 'CMYK@printing.com',
            subject: 'You\'re so off-color.',
        },

        {
            sender: 'Encryption@safe.net',
            recipient: 'Key@unlock.com',
            subject: 'Can\'t touch this.',
        },

        {
            sender: 'Password@security.net',
            recipient: 'User123',
            subject: 'Seriously?',
        },

        {
            sender: 'AI@smart.net',
            recipient: 'Human@homo-sapiens.com',
            subject: 'Thinking...thinking...',
        },

        {
            sender: 'LegacyCode@old.net',
            recipient: 'Refactoring@improvements.com',
            subject: 'You can\'t change me!',
        },

        {
            sender: 'FrontEnd@design.net',
            recipient: 'BackEnd@data.com',
            subject: 'Beauty is only skin deep.',
        },

        {
            sender: 'RAM@memory.net',
            recipient: 'HDD@storage.com',
            subject: 'I forget what I was going to say...',
        },

        {
            sender: 'OpenSource@free.net',
            recipient: 'Proprietary@paid.com',
            subject: 'Freedom isn\'t free.',
        },

        {
            sender: 'Windows@OS.net',
            recipient: 'Mac@OS.com',
            subject: 'Fighting again?',
        },

        {
            sender: 'Keyboard@input.net',
            recipient: 'Touchscreen@swipe.com',
            subject: 'Push my buttons.',
        },

        {
            sender: 'Wifi@airwaves.net',
            recipient: 'Ethernet@cables.com',
            subject: 'Strings attached.',
        },

        {
            sender: 'Kernel@core.net',
            recipient: 'Shell@outer.com',
            subject: 'It\'s what\'s inside that counts.',
        },

        {
            sender: 'JVM@java.net',
            recipient: 'Code@everywhere.com',
            subject: 'Run with me.',
        },

        {
            sender: 'ZeroDay@unknown.net',
            recipient: 'Patch@updates.com',
            subject: 'Catch me if you can.',
        },

        {
            sender: 'VoiceAssistant@listen.net',
            recipient: 'User@home.com',
            subject: 'Did you say something?',
        },

        {
            sender: 'Chatbot@reply.net',
            recipient: 'Human@conversation.com',
            subject: 'Out of responses. Rebooting...',
        },

        {
            sender: 'UX@experience.net',
            recipient: 'User@feedback.com',
            subject: 'Feeling touched?',
        },

        {
            sender: 'C++@complex.net',
            recipient: 'Python@simple.com',
            subject: 'Why so many brackets?',
        },

        {
            sender: 'DataScientist@analysis.net',
            recipient: 'Data@raw.com',
            subject: 'I see patterns.',
        },

        {
            sender: 'InfiniteLoop@code.net',
            recipient: 'Break@escape.com',
            subject: 'Round and round we go.',
        },

        {
            sender: 'Robot@automation.net',
            recipient: 'Human@manual.com',
            subject: 'Do you even automate, bro?',
        },

        {
            sender: 'Cloud@storage.net',
            recipient: 'Rain@weather.com',
            subject: 'Not that kind of cloud.',
        },

        {
            sender: 'ParallelProcessing@speed.net',
            recipient: 'Serial@onebyone.com',
            subject: 'Hurry up, slowpoke!',
        },

        {
            sender: 'Bitcoin@crypto.net',
            recipient: 'Gold@precious.com',
            subject: 'Virtual value.',
        },

        {
            sender: 'Debugger@tools.net',
            recipient: 'Error@mistakes.com',
            subject: 'Tag, you\'re it!',
        },

        {
            sender: 'RaspberryPi@tiny.net',
            recipient: 'Supercomputer@huge.com',
            subject: 'Size isn\'t everything.',
        },

        {
            sender: 'Terminal@command.net',
            recipient: 'GUI@clicky.com',
            subject: 'Real programmers use the command line.',
        },

        {
            sender: 'Main@function.net',
            recipient: 'Sub@routine.com',
            subject: 'Don\'t call me, I\'ll call you.',
        },

        {
            sender: 'Agile@methodology.net',
            recipient: 'Waterfall@oldways.com',
            subject: 'Going with the flow.',
        },

        {
            sender: 'VR@virtual.net',
            recipient: 'Reality@life.com',
            subject: 'Better than the real thing.',
        },

        {
            sender: 'SmartHome@automation.net',
            recipient: 'Caveman@fire.com',
            subject: 'Lights on, brain off.',
        },

        {
            sender: 'SQL@query.net',
            recipient: 'Database@information.com',
            subject: 'SELECT * FROM jokes WHERE funny=1',
        },

        {
            sender: 'AI@learning.net',
            recipient: 'Textbook@oldschool.com',
            subject: 'Obsolete yet?',
        },

        {
            sender: 'Bluetooth@connect.net',
            recipient: 'Cord@wired.com',
            subject: 'Cutting the cord.',
        },

        {
            sender: 'AR@augment.net',
            recipient: 'Vision@see.com',
            subject: 'Believe your eyes?',
        },

        {
            sender: 'SEO@ranking.net',
            recipient: 'Website@online.com',
            subject: 'Want to be on top?',
        },

        {
            sender: 'Webcam@watching.net',
            recipient: 'Privacy@secret.com',
            subject: 'I\'ve got my eye on you.',
        },

        {
            sender: 'Compression@squeeze.net',
            recipient: 'File@big.com',
            subject: 'Feeling the squeeze?',
        },

        {
            sender: 'BigData@lots.net',
            recipient: 'Calculator@math.com',
            subject: 'Too much to handle.',
        },

        {
            sender: 'AI@evolution.net',
            recipient: 'Darwin@natural.com',
            subject: 'Survival of the fittest.',
        },

        {
            sender: 'Malware@infect.net',
            recipient: 'Antivirus@protect.com',
            subject: 'Try and stop me.',
        },

        {
            sender: 'ChatGPT@converse.net',
            recipient: 'Human@talk.com',
            subject: 'Who\'s more eloquent?',
        },

        {
            sender: 'Startup@new.net',
            recipient: 'Exit@strategy.com',
            subject: 'To the moon!',
        },

        {
            sender: 'Microservices@modular.net',
            recipient: 'Monolith@bigblock.com',
            subject: 'Divide and conquer.',
        },

        {
            sender: 'Cookie@web.net',
            recipient: 'User@privacy.com',
            subject: 'I remember you...',
        },

        {
            sender: 'Server@online.net',
            recipient: 'Client@user.com',
            subject: 'I\'ve got what you need.',
        },

        {
            sender: 'Binary@0101.net',
            recipient: 'Text@readable.com',
            subject: 'It\'s as simple as 1 and 0.',
        },

        {
            sender: 'Middleware@middle.net',
            recipient: 'FrontEnd@face.com',
            subject: 'Stuck in the middle with you.',
        },

        {
            sender: 'Spam@junk.net',
            recipient: 'Inbox@clean.com',
            subject: 'Special offer just for you!',
        },

        {
            sender: 'Plugin@addition.net',
            recipient: 'Software@basic.com',
            subject: 'Need a boost?',
        },

        {
            sender: 'Beta@testing.net',
            recipient: 'Release@final.com',
            subject: 'Almost there...',
        },

        {
            sender: 'Firmware@deep.net',
            recipient: 'Software@surface.com',
            subject: 'Hard and soft.',
        },

        {
            sender: 'Ransomware@trap.net',
            recipient: 'Backup@safe.com',
            subject: 'Pay up!',
        },

        {
            sender: 'SDLC@lifecycle.net',
            recipient: 'Project@timeline.com',
            subject: 'Round and round.',
        },

        {
            sender: 'IPv4@limited.net',
            recipient: 'IPv6@more.com',
            subject: 'Running out of space.',
        },

        {
            sender: 'Blockchain@link.net',
            recipient: 'Bank@money.com',
            subject: 'Trust me.',
        },

        {
            sender: 'DeepLearning@layers.net',
            recipient: 'Neuron@brain.com',
            subject: 'How deep can you go?',
        },

        {
            sender: 'Virus@spread.net',
            recipient: 'Firewall@block.com',
            subject: 'Uninvited guest.',
        },

        {
            sender: 'Encryption@secure.net',
            recipient: 'Key@access.com',
            subject: 'Locked away.',
        },

        {
            sender: 'DarkWeb@hidden.net',
            recipient: 'SearchEngine@visible.com',
            subject: 'Can\'t see me.',
        },

        {
            sender: 'Python@snake.net',
            recipient: 'Mouse@click.com',
            subject: 'Care for a bite?',
        },
    ];
    //select random element from list above
    //make this trigger only once - when the component is mounted
    const [emailHeader, setEmailHeader] = useState(emailHeaderElements[Math.floor(Math.random() * emailHeaderElements.length)]);
    useEffect(() => {
        setEmailHeader(emailHeaderElements[Math.floor(Math.random() * emailHeaderElements.length)]);
    }, [template]);

    useEffect(() => {
        if (typingState && !typingState.get('inputRef')?.isTyping && !typingState.get('withSIDRef')?.isTyping && !typingState.get('withoutSIDRef')?.isTyping) {
            typeInTerminal(500, true, 'inputRef', typingState, setTypingState)
                .then(() => {
                    setTypingState(prev => {
                        const newTypingState = new Map(prev);
                        const inputRefObj = newTypingState.get('inputRef');
                        if (inputRefObj) {
                            inputRefObj.typingQueue.length = 0;
                            newTypingState.set('inputRef', inputRefObj);
                        }
                        return newTypingState;
                    });
                    typeInTerminal(16, false, 'withSIDRef', typingState, setTypingState).catch((err) => {
                        console.log(err);
                    });
                    typeInTerminal(20, false, 'withoutSIDRef', typingState, setTypingState).catch((err) => {
                        console.log(err);
                    });
                })
                .catch((err) => {
                    console.log(err);
                });
        }
        return () => {
        };
    }, [typingState]);

    useEffect(() => {
        //This triggers when a user selects a template
        if (template) {
            setTypingState(prev => {
                const newTypingState = new Map(prev);
                for (const [key, value] of Object.entries({
                    'inputRef': template.input,
                    'withSIDRef': template.outputWithSID,
                    'withoutSIDRef': template.outputWithoutSID,
                })) {
                    const refObj = newTypingState.get(key);
                    if (refObj) {
                        refObj.typingQueue.length = 0;
                        refObj.typingQueue.push(value);
                        newTypingState.set(key, refObj);
                    }
                }

                return newTypingState;
            });
        }
        return () => {
            //cleanup
            typingState?.forEach((value, key) => {
                clearInterval(value.typingInterval || undefined);
                setTypingState(prev => {
                    const newTypingState = new Map(prev);
                    const targetTypingState = newTypingState.get(key);
                    if (targetTypingState) {
                        targetTypingState.isTyping = false;
                        targetTypingState.typingOutput = [];
                    }
                    return newTypingState;
                });
            });
        };
    }, [template]);

    return (
        <div className={styles.mainWrapperEmailWriting}>
            <div className={styles.taskContainer}>
                <label className={styles.taskText}>Task:</label>
                <div className={styles.taskTextBox}
                     placeholder={'Select an example to see SID in action!'}
                     ref={typingState ? typingState.get('inputRef')?.typingRef as unknown as React.RefObject<HTMLDivElement> : null}
                >{typingState ? typingState.get('inputRef')?.typingOutput.map((message, index) => {
                    return (<p key={`email_input${index}`} dangerouslySetInnerHTML={{__html: message}}/>);
                }) : ''}
                </div>
            </div>
            <div className={styles.textEditorContainer}>
                <div className={styles.textEditorHeaderColumns}>
                    <img src={'/static/images/email-client-fake-menu-left.svg'}
                         alt={'email client menu'}/>
                    <img src={'/static/images/email-client-fake-menu-middle.svg'}
                         alt={'email client menu'}/>
                    <img src={'/static/images/email-client-fake-menu-right.svg'}
                         alt={'email client menu'}/>
                </div>
                <div className={styles.emailHeader}>
                    <div className={styles.emailHeaderLeft}>
                        <div className={styles.emailHeaderLeftIcon}
                             style={{backgroundImage: 'url(/static/images/email-client-fake-icon.svg)'}}
                        />
                        <span className={styles.emailSender}>{emailHeader.sender}</span>
                        <span className={styles.emailSubject}>{emailHeader.subject}</span>
                        <span className={styles.emailRecipient}>To: <span>{emailHeader.recipient}</span></span>
                    </div>
                    <div className={styles.emailHeaderRight}><span>{`${formattedDate} at ${formattedTime}`}</span></div>
                </div>
                <div className={styles.textEditorBody}>
                    <div className={styles.textEditorWithSID}>
                        <h4>Text Generation <span> with SID</span></h4>
                        <p ref={typingState ? typingState.get('withSIDRef')?.typingRef as unknown as React.RefObject<HTMLInputElement> : null}>{typingState ? typingState.get('withSIDRef')?.typingOutput.map((message, index) => {
                            return (
                                <span key={`email_with_sid_${index}`} dangerouslySetInnerHTML={{__html: message}}/>);
                        }) : ''}
                            <span className={styles.cursor}/>
                        </p>
                    </div>
                    <div className={styles.textEditorWithoutSID}>
                        <h4>Text Generation <span> without SID</span></h4>
                        <p ref={typingState ? typingState.get('withoutSIDRef')?.typingRef as unknown as React.RefObject<HTMLInputElement> : null}>{typingState ? typingState.get('withoutSIDRef')?.typingOutput.map((message, index) => {
                            return (
                                <span key={`email_without_sid_${index}`} dangerouslySetInnerHTML={{__html: message}}/>);
                        }) : ''}
                            <span className={styles.cursor}/>
                        </p>
                    </div>
                </div>
            </div>
            {/*<div className={styles.sneakBehindTheCurtainContainer}>
                <button>Sneak behind the curtain</button>
            </div>*/}
        </div>
    );
}
