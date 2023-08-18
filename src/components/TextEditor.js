import React, { useState, useRef, useMemo, useEffect } from 'react';
import ReactQuill from 'react-quill';
import { projectAuth, storage } from "../firebase/config";
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import Parser from 'html-react-parser';
import { useFirestore } from '../hooks/useFirestore';
import 'react-quill/dist/quill.snow.css';

// styles
import styles from './TextEditor.module.css';


export function TextEditor() {
    const [post, setPost] = useState('');
    const [title, setTitle] = useState('');
    const { addDocument, response } = useFirestore(projectAuth.currentUser.uid);
    const quillRef = useRef();

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

    const handlePostSubmit = () => {
        console.log('submitted')
        addDocument(
            { uid: projectAuth.currentUser.displayName,
              title,
              post }
        );
    }

    useEffect(() => {
        if (response.success) {
            setPost('')
        }
    }, [response.success])

    return <div className={styles.editor}>
            {Parser(post)}
            <label>
                <span>Title:</span>
                <input 
                    type="title"
                    onChange={(e) => setTitle(e.target.value)}
                    value={title}
                />
            </label>
            <ReactQuill 
                ref={quillRef}
                theme="snow" 
                value={post} 
                onChange={setPost} 
                modules={modules}
            />
            <button className='btn' onClick={handlePostSubmit}>Post</button>
        </div>
}