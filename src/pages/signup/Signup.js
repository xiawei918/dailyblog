import { useState } from 'react';
import { useSignup } from '../../hooks/useSignup';

// styles
import styles from './Signup.module.css';

export default function Signup() {
    const [displayName, setDisplayName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { isPending, error, signup } = useSignup();

    const handleSignupSubmit = (e) => {
        e.preventDefault();
        signup(email, password, displayName);
    }

    return (
        <form className={styles['signup-form']} onSubmit={handleSignupSubmit}>
            <h2>Signup</h2>
            <label>
                <span>display name:</span>
                <input 
                    type="text"
                    onChange={(e) => setDisplayName(e.target.value)}
                    value={displayName}
                />
            </label>
            <label>
                <span>email:</span>
                <input 
                    type="email"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                />
            </label>
            <label>
                <span>password:</span>
                <input 
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                />
            </label>
            {!isPending && <button className='btn'>Signup</button>}
            { isPending && <button className='btn' disabled>loading</button>}
            { error && <p>{error}</p> }
        </form>
    )
}