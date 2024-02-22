import axios from "axios";
import { createContext, useContext, useState } from "react";
const { VITE_API_URL } = import.meta.env;

const UserContext = createContext();

export const UserProvider = ({ children }) => {

    const storedData = localStorage.getItem('data');

    const [data, setData] = useState(
        storedData ? JSON.parse(storedData) : null
    );

    const changeData = ( newData ) => {
        setData(newData);
        localStorage.setItem('data', JSON.stringify(newData))
    };

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const signUp = async (props) => {
        if(loading) return;

        const { email, password, password2 } = props

        setError(null);
        setLoading(true);

        if( password !== password2 ) {
            throw new Error("Password doesn't match")
        }

        try {
            const { data } = await axios.post(`${VITE_API_URL}/auth/signup`, {
                email,
                password
            });
            changeData(data);
        } catch(error) {
            console.error(error);
            setError(error.response.data)
        } finally {
            setLoading(false)
        }
    }

    const logIn = async ( props ) => {
        if (loading) return;

        const { email, password } = props;

        setError(null);
        setLoading(true);

        try {
            const { data } = await axios.post(`${VITE_API_URL}/auth/login`, {
                email,
                password
            });
            changeData(data);
        } catch(error) {
            console.error(error);
            setError(error.response.data)
        } finally {
            setLoading(false)
        }
    };

    const logOut = () => {
        localStorage.removeItem('data');
        setData(null);
    };

    const contextValues = {
        ...data,
        logIn,
        signUp,
        logOut,
        error,
        loading
    };
    
    return (
        <UserContext.Provider value={contextValues}>
            { children }
        </UserContext.Provider>
    )
};

export const useUser = () => {
    const context = useContext( UserContext )

    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider')
    }

    return context
}
