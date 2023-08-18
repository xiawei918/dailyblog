import { useAuthContext } from '../../hooks/useAuthContext';
import styles from './Home.module.css';
import { TextEditor } from '../../components/TextEditor';

export default function Home() {
    const { user } = useAuthContext();
    console.log(user)
    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <p>Hello, {user && user.displayName}</p>
            </div>
        </div>
    )
}