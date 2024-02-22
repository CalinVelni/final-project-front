import axios from "axios"
import { axiosHeaders } from "../../library/utilities"
import { useUser } from "../../context/UserContext"
import { useEffect, useState } from "react"
const { VITE_API_URL } = import.meta.env

export default function () {

    const { user, token } = useUser();

    const [publishers, setPublishers] = useState();
    const [error, setError] = useState();
    const blankFormData = {
        name: '',
        country: ''
    };
    const [formData, setFormData] = useState(blankFormData);
    const [feedback, setFeedback] = useState();

    useEffect(() => {
        axios.get(`${VITE_API_URL}/publishers`, axiosHeaders(token))
            .then(obj => setPublishers(obj.data))
            .catch(e => {
                setError(e);
                console.error(e)
            })
    }, []);

    const addPublisher = (body) => {
        axios.post(`${VITE_API_URL}/publishers`, body, axiosHeaders(token))
            .then((obj) => {
                setPublishers(obj.data);
                setFeedback('Publisher added successfully.')
            })
            .catch(e => {
                setError(e);
                console.error(e)
            })
    };

    return(<>
        <h1>Publishers List</h1>
        {publishers && 
            publishers.map((pub) => {
                return (
                    <p key={pub._id}>{pub.name} | {pub.country}</p>
                )
            })
        }

        {user?.type === 'developer' &&
            <div>
                <h3>Add Publisher</h3>

                <div>
                    <label> <b>Name:</b>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={e => setFormData({
                                ...formData,
                                name: e.target.value
                            })}
                        />
                    </label>

                    <label> <b>Country:</b>
                        <input
                            type="text"
                            value={formData.country}
                            onChange={e => setFormData({
                                ...formData,
                                country: e.target.value
                            })}
                        />
                    </label>
                    <button
                        onClick={() => {
                            addPublisher(formData);
                            setFormData(blankFormData)
                        }}
                    >Add</button>
                </div>

                <p>{feedback}</p>
            </div>
        }
    </>)
}
