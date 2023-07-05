import React from 'react';
import styles from '@/styles/Home.module.css';
import ConnectSIDButton from "@/components/ConnectSIDButton";
import SidContainer from "@/components/SidContainer";
import {GetServerSideProps} from 'next';

type HomeProps = {
    isConnected: boolean;
}

const Home: React.FC<HomeProps> = ({isConnected}) => {
    return (
        <div className={styles.mainWrapper}>
            <section>
                <h1>SID Starter App</h1>
                <ConnectSIDButton isConnected={isConnected}/>
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
    let isConnected = false;

    if (cookies) {
        const cookiesArray = cookies.split('; ');
        const refreshTokenCookie = cookiesArray.find(cookie => cookie.startsWith('refreshToken='));
        if (refreshTokenCookie) {
            isConnected = true;
        }
    }

    return {
        props: {
            isConnected
        }
    }
}

export default Home;
