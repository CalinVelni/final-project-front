import { useState } from "react"
import { useUser } from "../../context/UserContext"

export default function ({ type }) {

    const { logIn, signUp, error, loading } = useUser();

    const title = type === 'login' ? 'Log In' : 'Sign Up';

    const [message, setMessage] = useState(null);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        password2: '',
        type: 'tester'
    });

    const signUser = (e) => {
        e.preventDefault()
        setMessage(null);
        const { email, password, password2 } = formData;
        if (type === 'login') {
            logIn(formData);
            setMessage('Logged In Successfully.')
        }
        else {
            if(password !== password2) {
                setMessage("Passwords don't match.");
                return
            }
            signUp(formData);
            setMessage('Signed Un Successfully.')
        }
    };

    return(
        <div className="page sign-user">
            
            <h1 className="center main-color">{title}</h1>

            <form onSubmit={signUser} className="form sign">
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
                    <>
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

                        <section className="form-field">
                            <p className="main-color">User Type</p>
                            <select
                                value={formData.type}
                                onChange={ e => {
                                    setFormData({
                                        ...formData,
                                        type: e.target.value
                                    })
                                }}
                            >
                                <option value="tester">Tester</option>
                                <option value="developer">Developer</option>
                            </select> 
                        </section>
                    </> 
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
                {!loading && !error && message && <div className="message center">{message}</div>}

            </form>

        </div>
    )
}