import {useEffect, useState} from "react";
import {getCookie} from "@/utils";
import axios from "axios";
import styles from '@/styles/SuggestionsPanel.module.scss';

export default function SuggestionsPanel({accessToken}: { accessToken: string }) {
    const [suggestions, setSuggestions] = useState<string[]>([]);

    useEffect(() => {
        if (suggestions.length === 0) {
            axios.post('api/example', {
                accessToken: accessToken,
                type: 'question',
            }).then((response) => {
                setSuggestions(response.data.answer);
            }).catch((err) => {
                console.error(err);
            });
        }
    }, []);
    if (suggestions.length === 0) {
        return <div>Loading...</div>;
    } else {
        return <div className={styles.panelWrapper}><div className={styles.panel}>{suggestions.map((suggestion, index) => {
            return <div className={styles.card} key={index}>{suggestion}</div>
        })}</div></div>
    }
}