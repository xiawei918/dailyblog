import { useEffect, useState } from "react";
import { projectAuth, projectFirestore } from "../firebase/config";
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from "firebase/auth";
import { useAuthContext } from "./useAuthContext";

export const useSignup = () => {
    const [isCancelled, setIsCancelled] = useState(false);
    const [error, setError] = useState(null);
    const [isPending, setIsPending] = useState(false);
    const { dispatch } = useAuthContext();

    const signup = async (email, password, displayName) => {
        setError(null);
        setIsPending(true);

        try {
            // signup user
            const response = await createUserWithEmailAndPassword(projectAuth, email, password);

            if (!response) {
                throw new Error('Could not complete signup');
            }

            await updateProfile(projectAuth.currentUser, { displayName });
            await sendEmailVerification(projectAuth.currentUser);


            // dispatch login action
            dispatch({ type: 'LOGIN', payload: projectAuth.currentUser });
            if (!isCancelled) {
                setIsPending(false);
                setError(null);
            }
        }
        catch (err) {
            if (!isCancelled) {
                console.log(err.message);
                setError(err.message);
                setIsPending(false);
            }
        }
    }

    useEffect(() => {
        return () => setIsCancelled(true);
    }, []);

    return { error, isPending, signup }
}