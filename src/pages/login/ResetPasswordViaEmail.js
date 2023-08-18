import { useState } from 'react';
import { useResetPasswordViaEmail } from '../../hooks/useResetPasswordViaEmail';

// styles
import styles from './ResetPasswordViaEmail.module.css';

export default function ResetPasswordViaEmail() {
    const [email, setEmail] = useState('');
    const { resetPasswordViaEmail, error, isPending } = useResetPasswordViaEmail();

    const handleResetPasswordSubmit = (e) => {
        e.preventDefault();
        resetPasswordViaEmail(email);
    }

    return (
        <form className={styles['reset-password-form']} onSubmit={handleResetPasswordSubmit}>
            <h2>Reset Password</h2>
            <label>
                <span>email:</span>
                <input 
                    type="email"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                />
            </label>
            
            { !isPending && <button className='btn'>Send Recovery Email</button>}
            { isPending && <button className='btn' disabled>loading</button>}
            { error && <p>{error}</p>}
        </form>
    )
}