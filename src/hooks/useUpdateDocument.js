import { useEffect, useState } from "react"
import { projectFirestore } from "../firebase/config"
import { doc, updateDoc } from "firebase/firestore";


export const useUpdateDocument = () => {
    const [isCancelled, setIsCancelled] = useState(false);
    const [error, setError] = useState(null);
    const [isPending, setisPending] = useState(null);

    const updateDocument = async (collection, id, document) => {
        setError(null);
        setisPending(true);

        try {
            await updateDoc(doc(projectFirestore, collection, id), document);

            if (!isCancelled) {
                setisPending(false);
                setError(null);
            }
        }
        catch (err) {
            if (!isCancelled) {
                console.log(err.message);
                setError(err.message);
                setisPending(false);
            }
        }
    }

    useEffect(() => {
        setIsCancelled(false);
        return () => setIsCancelled(true);
    }, []);

  return { error, isPending, updateDocument }
}