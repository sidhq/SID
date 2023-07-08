import React, {useState} from 'react';
import styles from '@/styles/Home.module.css';
import ConnectSIDButton from "@/components/ConnectSIDButton";
import SidContainer from "@/components/SidContainer";
import {GetServerSideProps} from 'next';

type HomeProps = {
    initialIsConnected: boolean;
    sidURL: string;
}

const Home: React.FC<HomeProps> = ({initialIsConnected, sidURL}) => {
    const [isConnected, setIsConnected] = useState(initialIsConnected);

    const handleDisconnect = () => {
        setIsConnected(false);
    }
    return (
        <div className={styles.mainWrapper}>
            <section>
                <h1>SID Starter App</h1>
                <div style={
                    {
                        display:"inline-block"
                    }
                }><ConnectSIDButton width={330}
                                    height={50}
                                    fontScale={1}
                                    isConnected={isConnected}
                                    onDisconnect={handleDisconnect}
                                    href={sidURL}

                /></div>
            </section>

            <section>
                <h3>Ask your question</h3>
                <SidContainer/>
            </section>
        </div>
    )
};

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
            sidURL: process.env.SID_CALLBACK_URL || ""
        }
    }
}

export default Home;
