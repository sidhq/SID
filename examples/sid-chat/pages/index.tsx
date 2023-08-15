import React, {useState} from 'react';
import styles from '@/styles/Home.module.scss';
import {GetServerSideProps} from 'next';
import {getEnvVar} from "@/utils";
import Link from "next/link";
import ChatBox from "@/components/ChatBox";
import AccessTokenContainer from "@/components/AccessTokenContainer";
import {SIDButton} from "@sid-hq/sid";
import SignUpToday from "@/components/SignUpToday";
import RequestAccessButton from "@/components/RequestAccessButton";
import SidSVG from "@/components/SidSVG";

type HomeProps = {
    initialIsConnected: boolean;
    sidURL: string;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const cookies = context.req.headers.cookie;
    let initialIsConnected = false;

    if (cookies) {
        const cookiesArray = cookies.split('; ');
        const refreshTokenCookie = cookiesArray.find(cookie => cookie.startsWith('refreshToken='));
        if (refreshTokenCookie) {
            initialIsConnected = true;
        }
    }

    return {
        props: {
            initialIsConnected,
            sidURL: getEnvVar("SID_CALLBACK_URL")
        }
    }
}
const Home: React.FC<HomeProps> = ({initialIsConnected, sidURL}) => {
    const [isConnected, setIsConnected] = useState(initialIsConnected);

    const handleDisconnect = async () => {
        // Add your code here to handle the disconnect SID
        console.log('Disconnect button clicked');
        try {
            const response = await fetch('/api/disconnect', {
                method: 'POST', // or 'GET' depending on the API requirements
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                // If disconnection is successful, call the passed in function
                console.log('Disconnected successfully!');
                setIsConnected(false);
            } else {
                console.error('Failed to disconnect.');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }
    return (
        <>
            <header className={styles.header}>
                <SidSVG width={75} height={75} fill={'#F4E7D4'}/>
                <RequestAccessButton/>
            </header>
            <div className={styles.mainWrapper}>
                <h1>See how SID personalizes LLMs for you</h1>
                <p>Connect your data with the button below and see how SID provides real-time data as context to the
                    chat.
                </p>
                <div className={styles.infoTop}>
                    <SIDButton width={330}
                               height={50}
                               fontScale={1}
                               isConnected={isConnected}
                               onDisconnect={handleDisconnect}
                               href={sidURL}
                               className={styles.sidButton}

                    />
                    {isConnected ? <AccessTokenContainer/> : null}
                </div>
                <ChatBox/>
                <SignUpToday/>
                <p>
                    By using this demo, you agree to our <Link href={'https://static.sid.ai/privacy.html'}>Privacy
                    Policy</Link> and <Link href={'https://static.sid.ai/tos.html'}>Terms of Service</Link>.
                    Please also see <Link href={'https://sid.ai/disclosures'}>disclosures</Link>.
                </p>
            </div>
        </>
    )
};

export default Home;
