import { useParams } from 'react-router-dom';
import { useDocument } from '../../hooks/useDocument';
import Parser from 'html-react-parser';

// styles
import styles from './Post.module.css';

export default function Post() {
  const { id } = useParams()
  const { document: post, error } = useDocument('posts', id)
  console.log(post)

  return (
    <div className={styles.post}>
      {error && <p className="error">{error}</p>}
      {post && (
        <>
          <h1 className={styles.title}>{post.title}</h1>
          <p>{post.createdAt.toDate().toDateString()}</p>
          <div className={styles['post-content']}>
            {Parser(post.post)}
          </div>
        </>
      )}
    </div>
  )
}