import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { useUser } from "../../context/UserContext"

export default function ({ type }) {

    const { logIn, signUp, error, loading } = useUser();

    const title = type === 'login' ? 'Log In' : 'Sign Up';

    const [pswMatchError, setPswMatchError] = useState(null)
    const [formData, setFormData] = useState({
        email: 'user@developer.com',
        password: 'Pass123!',
        password2: ''
    });

    const signUser = (e) => {
        e.preventDefault()
        setPswMatchError(null);
        const { email, password, password2 } = formData;
        if (type === 'login') {
            logIn(formData)
        }
        else {
            if(password !== password2) {
                setPswMatchError("Passwords don't match.");
                return
            }
            signUp(email, password)
        }
    };

    return(
        <div className="page sign-user">
            
            <h1 className="center main-color">{title}</h1>

            <form onSubmit={signUser}>
                <section className="form-field">
                    <p className="main-color">Email</p>
                    <input 
                        type="email"
                        required
                        value={formData.email}
                        onChange={ e => {
                            setFormData({
                                ...formData,
                                email: e.target.value
                            })
                        }}
                    />
                </section>

                <section className="form-field">
                    <p className="main-color">Password</p>
                    <input 
                        type="password"
                        required
                        value={formData.password}
                        onChange={ e => {
                            setFormData({
                                ...formData,
                                password: e.target.value
                            })
                        }}
                    />
                </section>

                { type === 'signup' && 
                    <section className="form-field">
                        <p className="main-color">Confirm Password</p>
                        <input 
                            type="password"
                            required
                            value={formData.password2}
                            onChange={ e => {
                                setFormData({
                                    ...formData,
                                    password2: e.target.value
                                })
                            }}
                        />
                    </section>
                }

                <section className="form-field">
                    <button
                        disabled={loading}
                        onClick={e => signUser(e)}
                    >
                        {title}
                    </button>
                </section>

                {loading && <div className="message center">Loading...</div> }
                {error && <div className="message center">{error}</div> }
                {pswMatchError && <div className="message center">{pswMatchError}</div>}
            </form>

        </div>
    )
}