import { Link } from 'react-router-dom';

import styles from './PostList.module.css';

export default function PostList({ posts }) {

    return (
        <ul className={styles.posts}>
            {posts.map((post) => (
                <li key={post.id}>
                    <p className={styles.title}><Link to={"/posts/" + post.id}>{post.title}</Link></p>
                    <p className={styles.createdat}>{post.createdAt.toDate().toDateString()}</p>
                </li>
            ))}
        </ul>
    )
}