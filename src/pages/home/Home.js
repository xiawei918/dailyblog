import { useAuthContext } from '../../hooks/useAuthContext';
import PostList from '../../components/PostList';
import { useCollection } from '../../hooks/useCollection';
import { Link } from 'react-router-dom';

import styles from './Home.module.css';

export default function Home() {
    const { user } = useAuthContext();
    const { documents, error } = useCollection(
        'posts', 
        ["uid", "==", user.uid],
        ["createdAt", 'desc']
        );

        return (
        <div className={styles.container}>
            <div className={styles.content}>
                <p><Link to={"/author/" + user.uid}>Link To Your Daily Blog</Link></p>
                {error && <p>{error}</p>}
                {documents && <PostList posts={documents}/>}
                <Link to="/createpost"><button className='btn'>Write a post</button></Link>
            </div>
        </div>
    )
}