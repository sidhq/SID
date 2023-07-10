import React, {useState} from 'react';
import styles from '@/styles/Home.module.scss';
import ConnectSIDButton from "@/components/ConnectSIDButton";
import {GetServerSideProps} from 'next';
import {getEnvVar} from "@/utils";
import Link from "next/link";
import ChatBox from "@/components/ChatBox";

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

    const handleDisconnect = () => {
        setIsConnected(false);
    }
    return (
        <div className={styles.mainWrapper}>
            <div className={styles.innerWrapper}>
                <h1>SID Chat</h1>
                <p>
                    Want to see yourself what SID can do for you?<br/>
                    Try this side-by-side of a SID-enabled chat assistant and regular ChatGPT!
                </p>
                <ConnectSIDButton width={330}
                                  height={50}
                                  fontScale={1}
                                  isConnected={isConnected}
                                  onDisconnect={handleDisconnect}
                                  href={sidURL}

                />
                <ChatBox/>
                <p>
                    Pretty cool, huh? <br/>
                    Are you a builder and would like to integrate SID into your own app? <br/>
                    Click <Link href={'https://join.sid.ai/'}>here</Link> to join our waitlist!
                </p>
            </div>
        </div>
    )
};

export default Home;
