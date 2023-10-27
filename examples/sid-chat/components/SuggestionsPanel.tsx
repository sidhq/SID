import {useEffect, useState} from "react";
import {getCookie} from "@/utils";
import axios from "axios";

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
    return <>{suggestions.length >= 0 ? suggestions.map((suggestion, index) => {
        return <div key={index}>{suggestion}</div>
    }) : <></>}</>
}