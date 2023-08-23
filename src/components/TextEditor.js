import React, { useState, useRef, useMemo, useEffect } from 'react';
import ReactQuill from 'react-quill';
import { projectAuth, storage } from "../firebase/config";
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import Parser from 'html-react-parser';
import { useNavigate } from 'react-router-dom'
import { useFirestore } from '../hooks/useFirestore';
import 'react-quill/dist/quill.snow.css';

// styles
import styles from './TextEditor.module.css';


export function TextEditor() {
    const [post, setPost] = useState('');
    const [title, setTitle] = useState('');
    const { addDocument, response } = useFirestore('posts');
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
                        <button className='btn' onClick={handlePostSubmit}>Post</button>
                    </div>
                </div>
            </div>
}