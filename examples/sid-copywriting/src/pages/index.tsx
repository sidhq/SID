import styles from '@/styles/Home.module.scss'
import CopyWriting from "@/components/copyWriting";


export default function Home() {
    return (
        <div className={styles.mainWrapper}>
            <CopyWriting/>
        </div>
    )
}
