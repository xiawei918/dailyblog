import { useParams } from 'react-router-dom';
import PostList from '../../components/PostList';
import { useCollection } from '../../hooks/useCollection';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../../hooks/useAuthContext';

import styles from './Authorhome.module.css';

export default function AuthorHome() {
    const { user } = useAuthContext();
    const { uid } = useParams();
    const { documents, error } = useCollection(
        'posts',
        ["uid", "==", uid],
        ["createdAt", 'desc'],
        );

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                {error && <p>{error}</p>}
                {documents && <PostList posts={documents}/>}
                {user?.uid == uid && <Link to="/createpost"><button className='btn'>Write a post</button></Link>}
            </div>
        </div>
    )
}