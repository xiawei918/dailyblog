import { useAuthContext } from '../../hooks/useAuthContext';
import styles from './createpost.module.css';
import { TextEditor } from '../../components/TextEditor';

export default function CreatePost() {
    const { user } = useAuthContext();

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                {user && <TextEditor />}
            </div>
        </div>
    )
}