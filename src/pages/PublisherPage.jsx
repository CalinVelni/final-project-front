import axios from "axios"
import NotFound from '../pages/NotFound'
import { axiosHeaders } from "../../library/utilities"
import { useUser } from "../../context/UserContext"
import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import dayjs from "dayjs"
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
    const [feedback, setFeedback] = useState(null);
    const [fbError, setFbError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`${VITE_API_URL}/publishers/${slug}`, axiosHeaders(token))
            .then(obj => setPublisher(obj.data))
            .catch(e => {
                setError('Error: Server connection failed.');
                console.error(e)
            })
    }, [slug]);

    const tempFeedback = (fb) => {  // Sets a feedback message for operations succeed that disappear after 2.5s
        setFeedback(fb);
        setTimeout(() => {
            setFeedback(null)
          }, '2500');
    };

    const editPublisher = (props) => {
        const validProps = {}; // Filter the props removing the empty ones
        Object.entries(props).forEach(([key, value]) => {
            if(value !== '' && value !== undefined) {
                validProps[key] = value
            }
        });
        if(Object.keys(validProps).length > 0) {
            axios.patch(`${VITE_API_URL}/publishers/${slug}`, validProps, axiosHeaders(token))
                .then(obj => {
                    if(slug !== obj.data.slug){navigate(`/publishers/${obj.data.slug}`)}; // If the name is patched the slug will change, so we need to navigate to the new link
                    tempFeedback('Publisher updated successfully');
                    setPublisher(obj.data)
                })
                .catch(e => {
                    setFbError('Edit Publisher failed: Insert valid data.');
                    console.error(e)
                })
        }
    };

    return(
        <div className="page resource-page">
            {error &&
                <NotFound/>
            }

            {!error && !publisher &&
                <p className="message center">Loading...</p>
            }

            {publisher && <>
                <h1 className="main-color center">{publisher.name}</h1>

                <section className="center">
                    <p className={feedback ? 'sec-color' : 'error'}>{fbError || feedback}</p>
                </section>
            
                <div className="resource-wrapper">

                    <section className="resource-props">
                        <p><span className="main-color">Country: </span>{` ${publisher.country}`}</p>
                        <p><span className="main-color">Founded: </span>{` ${dayjs(publisher.createdAt).format('DD-MM-YYYY')}`}</p>
                        <div>
                            <span className="main-color">Games: </span>
                            <ul>
                                {publisher.games?.map(g => {
                                    return (
                                        <li key={`${g._id}`} className="center">
                                            <Link
                                                to={`/games/${g.slug}`}
                                                className={'link'}
                                            >{`${g.title}`}</Link>
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>
                    </section>

                    <section className="edit-resource">
                        
                        <h3 className="center sec-color">Edit Publisher</h3>
                        
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
                                        editPublisher(formData);
                                        setFormData(blankFormData)
                                    }}
                                >Edit</button>
                            </section>
                        </div>

                    </section>

                </div>
            </>}
        </div>
    )
}