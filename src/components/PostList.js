import { projectAuth } from '../firebase/config';

import styles from './PostList.module.css';

export default function PostList({ posts }) {

    return (
        <ul className={styles.posts}>
            {posts.map((post) => (
                <li key={post.id}>
                    <p className={styles.title}>{post.title}</p>
                    <p className={styles.createdat}>{post.createdAt.toDate().toDateString()}</p>
                </li>
            ))}
        </ul>
    )
}