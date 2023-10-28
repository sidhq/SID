import React, {useEffect, useState} from "react";
import {getCookie} from "@/utils";
import axios from "axios";
import styles from '@/styles/SuggestionsPanel.module.scss';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

export default function SuggestionsPanel({suggestions}: { suggestions: string[] }) {

    return (
        <div className={styles.panelWrapper}>
            <div className={styles.panelHeader}>
                <img src="static/images/lightbulb.svg" alt=""/>
                <h3>Personal Examples</h3>
            </div>

            {suggestions.length > 0 ? <div className={styles.panel}>{suggestions.map((suggestion, index) => {
                    return (
                        <div className={styles.card} key={index}>
                            <span className={styles.cardSuggestion}>{suggestion}</span>
                            <img src="static/images/paperplane.svg" alt="Send"/>
                        </div>
                    );
                })}</div> :
                <div className={styles.panel}><Skeleton
                    baseColor={'#777777'}
                    highlightColor={'#a4a4a4'}
                    height={50}
                    duration={1}
                    inline={true}
                    count={3}
                /></div>
            }
        </div>)
}