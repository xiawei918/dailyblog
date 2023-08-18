import { useAuthContext } from '../../hooks/useAuthContext';
import styles from './Home.module.css';
import { Link } from 'react-router-dom';

export default function Home() {
    const { user } = useAuthContext();
    console.log(user)
    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <p>Hello, {user && user.displayName}</p>
                <Link to="/createpost"><button>Write a post</button></Link>
            </div>
        </div>
    )
}