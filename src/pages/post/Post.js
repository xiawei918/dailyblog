import { useParams } from 'react-router-dom';
import { useDocument } from '../../hooks/useDocument';
import { projectAuth } from "../../firebase/config";
import { TextEditor } from '../../components/TextEditor';
import Parser from 'html-react-parser';

// styles
import styles from './Post.module.css';
import { useEffect, useState } from 'react';

export default function Post() {
  const { id } = useParams()
  const [ isEditing, setIsEditing ] = useState(false);
  const { document: post, error } = useDocument('posts', id)

  const handleEditClick = () => {
    setIsEditing(true);
  }

  useEffect(() => {
    setIsEditing(false);
  }, [])

  return (
    <div className={styles.post}>
      {error && <p className="error">{error}</p>}
      {post && !isEditing && (
        <>
          <h1 className={styles.title}>{post.title}</h1>
          <p>{post.createdAt.toDate().toDateString()}</p>
          <div className={styles['post-content']}>
            {Parser(post.post)}
          </div>
          {projectAuth.currentUser && <button className='btn' onClick={handleEditClick}>Edit</button>}
        </>
      )}
      {isEditing && <TextEditor postID={id} titleContent={post.title} postContent={post.post} isEditing={isEditing} setIsEditing={setIsEditing}/>}
    </div>
  )
}