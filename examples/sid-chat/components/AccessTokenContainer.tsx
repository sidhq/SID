import React, {useEffect, useState} from 'react';
import styles from '@/styles/AccessTokenContainer.module.scss';
import {getCookie} from "@/utils";
import axios from "axios";

const AccessTokenContainer: React.FC = () => {
    const [copyBox, setCopyBox] = useState<string>('Copy');
    const inputRef = React.useRef<HTMLInputElement>(null);
    const [accessToken, setAccessToken] = useState<string>('');  // State for access tokens for the terminal
    const handleCopyToClipboard = () => {
        if (inputRef.current) {
            inputRef.current.select();
        }
        navigator.clipboard.writeText(accessToken).then(() => {
            setCopyBox('Copied!');
            setTimeout(() => {
                setCopyBox('Copy');
            }, 750);
        }).catch(err => {
            console.error('Could not copy text to clipboard:', err);
        });
    };


    useEffect(() => {
        const refreshToken = getCookie('refreshToken');
        //fetch to api/getAccessToken to get access token from refreshToken
        axios.post('api/getAccessToken', {
            refreshToken: refreshToken,
        }).then((response) => {
            //set access token
            setAccessToken(response.data.accessToken);
        }).catch((err) => {
            setAccessToken('<access_token>');
        });
    }, []);

    return (
        <div className={styles.accessTokenContainer}>
            <div className={styles.accessTokenContainerHeader}><span>Access Token:</span></div>
            <div className={styles.accessTokenContainerBody}>
                <input
                    value={accessToken}
                    readOnly
                    ref={inputRef}
                    onClick={handleCopyToClipboard}
                />
                <button onClick={handleCopyToClipboard}>
                    {copyBox}
                </button>
            </div>
        </div>
    );
}

export default AccessTokenContainer;
