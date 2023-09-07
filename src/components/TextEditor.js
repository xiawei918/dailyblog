import React, { useState, useRef, useMemo, useEffect } from 'react';
import ReactQuill from 'react-quill';
import { projectAuth, storage } from "../firebase/config";
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { useUpdateDocument } from '../hooks/useUpdateDocument';
import Parser from 'html-react-parser';
import { useNavigate } from 'react-router-dom'
import { useFirestore } from '../hooks/useFirestore';
import 'react-quill/dist/quill.snow.css';

// styles
import styles from './TextEditor.module.css';


export function TextEditor({postID, postContent, titleContent, isEditing, setIsEditing}) {
    const postIDRef = useRef(postID).current;
    const postContentRef = useRef(postContent).current;
    const titleContentRef = useRef(titleContent).current;

    const [post, setPost] = useState('');
    const [title, setTitle] = useState('');
    const { addDocument, response } = useFirestore('posts');
    const { updateError, isPending, updateDocument } = useUpdateDocument();

    const quillRef = useRef();
    const navigate = useNavigate();

    const imageHandler = () => {
        const editor = quillRef.current.getEditor();
        const input = document.createElement('input');

        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();

        input.onchange = async () => {
            const imageFile = input.files[0];

            const imageUploadPath = `images/${projectAuth.currentUser.uid}/${imageFile.name}`
            const img = await uploadBytesResumable(ref(storage, imageUploadPath), imageFile);
            const imgUrl = await getDownloadURL(img.ref);

            // Insert uploaded image
            editor.insertEmbed(editor.getSelection(true).index, 'image', imgUrl);
        }
    }

    const modules = useMemo(() => ({
        toolbar: {
            container: [
                [{ header: '1' }, { header: '2' }, { header: [3, 4, 5, 6] }, { font: [] }],
                [{ size: [] }],
                ['bold', 'italic', 'underline', 'strike', 'blockquote', 'code'],
                [{color: []}, {background: []}],
                [{ list: 'ordered' }, { list: 'bullet' }, {'indent': '-1'}, {'indent': '+1'}],
                ['link', 'image', 'video'],
                ['clean'],
                ['code-block']
            ],
            handlers: {
                image: imageHandler
            },
        }
    }), []);

    const handlePostSubmit = async() => {
        console.log('submitted')
        await addDocument(
            { uid: projectAuth.currentUser.uid,
              title,
              post,
              author: projectAuth.currentUser.displayName }
        );
        if (!response.error) {
            navigate('/')
        }
    }

    useEffect(() => {
        if (response.success) {
            setPost('');
            setTitle('');
        }
    }, [response.success])

    useEffect(() => {
        if (postContent) {
            setPost(postContentRef);
        }
        if (titleContent) {
            setTitle(titleContentRef);
        }
    }, [postContentRef, titleContentRef])

    const HandlePostUpdate = async() => {
        await updateDocument('posts', postIDRef, 
            { uid: projectAuth.currentUser.uid,
              title,
              post,
              author: projectAuth.currentUser.displayName }
        );
        setIsEditing(false);
        navigate(`/posts/${postIDRef}`);
    }

    return <div className={styles.previeweditor}>
                <div className={styles.preview}>
                    <h2>{title}</h2>
                    {Parser(post)}
                </div>
                <div className={styles.editor}>
                    <label>
                        <span>Title:</span>
                        <input 
                            type="title"
                            required
                            onChange={(e) => setTitle(e.target.value)}
                            value={title}
                        />
                    </label>
                    <div className={styles.quill}>
                        <ReactQuill 
                            ref={quillRef}
                            theme="snow" 
                            value={post}
                            onChange={setPost}
                            modules={modules}
                        />
                    </div>
                    <div className={styles['submit-button']}>
                        {!isEditing && <button className='btn' onClick={handlePostSubmit}>Post</button>}
                        {isEditing && !isPending && <button className='btn'  onClick={HandlePostUpdate}>Save</button>}
                        {isEditing && isPending && <button className='btn' disabled >Saving</button>}
                    </div>
                    {updateError && <p className='error'>{updateError}</p>}
                </div>
            </div>
}