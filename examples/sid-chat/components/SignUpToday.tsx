import React, {ChangeEvent, useEffect} from 'react';
import styles from "@/styles/SignUpToday.module.scss";
import Link from "next/link";
import RequestAccessButton from "@/components/RequestAccessButton";


export default function SignUpToday() {
    return (
        <div className={styles.wrapperSignUpToday}>
            <h2>Sign up today.</h2>
            <RequestAccessButton/>
            <Link
                className={styles.link}
                href="https://docs.sid.ai/">
                Docs
            </Link>
        </div>
    );

}