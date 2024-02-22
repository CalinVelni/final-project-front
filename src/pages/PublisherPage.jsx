import axios from "axios"
import { axiosHeaders } from "../../library/utilities"
import { useUser } from "../../context/UserContext"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
const { VITE_API_URL } = import.meta.env

export default function () {

    const { user, token } = useUser();
    const { slug } = useParams()

    const [publisher, setPublisher] = useState();
    const [error, setError] = useState();
    const blankFormData = {
        name: '',
        country: ''
    };
    const [formData, setFormData] = useState(blankFormData);
    const [feedback, setFeedback] = useState();

    useEffect(() => {
        axios.get(`${VITE_API_URL}/publishers/${slug}`, axiosHeaders(token))
            .then(obj => setPublisher(obj.data))
            .catch(e => {
                setError(e);
                console.error(e)
            })
    }, []);

    return(<>
        <h1>Publisher Page</h1>
        {publisher && 
            <ul>
                <li>
                    Name: {publisher.name}
                </li>
                <li>
                    Country: {publisher.country}
                </li>
                <li>
                    Games: {publisher.games.map(g => ` ${g.title}, `)}
                </li>
            </ul>
        }
    </>)
}