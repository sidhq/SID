import React, {ChangeEvent, useEffect} from 'react';
import styles from "@/styles/RequestAccessButton.module.scss";
import Link from "next/link";


export default function RequestAccessButton() {
    return (
            <Link
                className={styles.requestAccessLink}
                href="https://app.sid.ai/">
                Get started
            </Link>
    );

}