import { useEffect, useRef, useState } from "react";
import { projectFirestore } from "../firebase/config";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore"


export const useCollection = (collectionName, _query, _orderBy) => {
    const [documents, setDocuments] = useState(null);
    const [error, setError] = useState(null);

    // if we don't use useRef we will have an infinite loop;
    // because the qeury array will be reconsutrcted every
    // time the dom is mounted
    const queryRef = useRef(_query).current;
    const orderByRef = useRef(_orderBy).current;

    useEffect(() => {
        let collectionRef = collection(projectFirestore, collectionName);
        let q = collectionRef;

        if (queryRef.length > 0) {
            q = query(collectionRef, where(...queryRef));
        }
        if (orderByRef.length > 0) {
            q = query(collectionRef, orderBy(...orderByRef));
        }
        if (queryRef.length > 0 & orderByRef.length > 0) {
            q = query(collectionRef, where(...queryRef) ,orderBy(...orderByRef));
        }

        const unsubscribe = onSnapshot(q, (snapshot) => {
            let results = [];
            snapshot.docs.forEach(doc => {
                results.push({ ...doc.data(), id: doc.id })
            })

            setDocuments(results);
            setError(null);
        }, (error) => {
            console.log(error);
            setError('could not ferch the data')
        });

        return () => unsubscribe();

    }, [collectionName, queryRef, orderByRef]);

    return { documents, error};
}