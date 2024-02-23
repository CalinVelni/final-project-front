import axios from "axios"
import { axiosHeaders } from "../../library/utilities"
import { useUser } from "../../context/UserContext"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
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
    const [feedback, setFeedback] = useState(null);
    const [fbError, setFbError] = useState(null);


    useEffect(() => {
        axios.get(`${VITE_API_URL}/publishers`, axiosHeaders(token))
            .then(obj => setPublishers(obj.data))
            .catch(e => {
                setError('Error: Server connection failed.');
                console.error(e)
            })
    }, []);

    const tempFeedback = (fb) => {  // Sets a feedback message for operations succeed that disappear after 2.5s
        setFeedback(fb);
        setTimeout(() => {
            setFeedback(null)
          }, '2500');
    };
    
    const addPublisher = (body) => {
        axios.post(`${VITE_API_URL}/publishers`, body, axiosHeaders(token))
            .then((obj) => {
                setFbError(null);
                setPublishers(obj.data);
                tempFeedback('Publisher added successfully.')
            })
            .catch(e => {
                setFbError('Add new publisher failed: Insert valid data.');
                console.error(e)
            })
    };

    const deletePublisher = (slug) => {
        axios.delete(`${VITE_API_URL}/publishers/${slug}`, axiosHeaders(token))
            .then(obj => {
                setFbError(null);
                setPublishers(obj.data);
                tempFeedback('Publisher deleted successfully.')
            })
            .catch(e => {
                setFbError(e.response.data);
                console.error(e)
            })
    };

    return(
        <div className="page collection-page">
            {error &&
                <p className="error center">{error}</p>
            }

            {!error && !publishers &&
                <p className="message center">Loading...</p>
            }

            {publishers && <>
                <h1 className="main-color center">Publishers List</h1>

                <section className="center">
                    <p className={feedback ? 'sec-color' : 'error'}>{fbError || feedback}</p>
                </section>

                <div className="collection-wrapper">

                    {publishers?.length < 1 && <p className="sec-color center">No publishers available, add one.</p>}

                    <ul className="collection-list center">
                        {publishers.map(pub => {
                            return (
                                <li key={`${pub._id}`}>
                                    <Link
                                        to={`/publishers/${pub.slug}`}
                                        className={'link'}
                                        >
                                        {`${pub.name} `}<span className="main-color">|</span>{` ${pub.country}`}
                                    </Link>
                                    <button
                                        onClick={() => deletePublisher(pub.slug)}
                                    >Delete</button>
                                </li>
                            )
                        })}
                    </ul>

                    
                    <section className="add-resource">
                        <h3 className="center sec-color">Add new publisher</h3>
                        <div className="form">
                            <section className="form-field">
                                <p className="main-color">Name</p>
                                <input 
                                    type="text" 
                                    value={formData.name}
                                    onChange={e => setFormData({
                                        ...formData,
                                        name: e.target.value
                                    })}
                                />
                            </section>

                            <section className="form-field">
                                <p className="main-color">Country</p>
                                <input 
                                    type="text" 
                                    value={formData.country}
                                    onChange={e => setFormData({
                                        ...formData,
                                        country: e.target.value
                                    })}
                                />
                            </section>
                            
                            <section className="form-field">
                                <button
                                    onClick={() => {
                                        addPublisher(formData);
                                        setFormData(blankFormData)
                                    }}
                                >Add</button>
                            </section>
                        </div>
                    </section>
                </div>
            
                
            </>}


        </div>
    )
}
