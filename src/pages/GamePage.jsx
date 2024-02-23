import axios from "axios"
import { axiosHeaders } from "../../library/utilities"
import { useUser } from "../../context/UserContext"
import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import dayjs from "dayjs"
const { VITE_API_URL } = import.meta.env

export default function () {

    const { user, token } = useUser();
    const { slug } = useParams()

    // GAME RESOURCE and COLLECTIONS (Genres and Publishers needed for the select options)    
    const [game, setGame] = useState();
    const [genres, setGenres] = useState();
    const [publishers, setPublishers] = useState();
    
    
    const [refresh, setRefresh] = useState(false); // State for the useEffect [], needed in case of patching publisher for updating the link at the right slug
    const [error, setError] = useState();
    const blankFormData = {
        title: '',
        publisher: '',
        genre: '',
        cover: '',
        description: '',
    };
    const [formData, setFormData] = useState(blankFormData);
    const [feedback, setFeedback] = useState(null);
    const [fbError, setFbError] = useState(null);
    const navigate = useNavigate();

    // SETTING GAME RESOURCE AND COLLECTIONS
    useEffect(() => {
        axios.get(`${VITE_API_URL}/games/${slug}`, axiosHeaders(token))
            .then(obj => setGame(obj.data))
            .catch(e => {
                setError('Error: Server connection failed.');
                console.error(e)
            })
    }, [slug, refresh]);

    useEffect(() => {
        axios.get(`${VITE_API_URL}/genres`, axiosHeaders(token))
            .then(obj => setGenres(obj.data))
            .catch(e => {
                setError('Error: Server connection failed.');
                console.error(e)
            })
    }, []);

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

    const editGame= (props) => {
        const validProps = {}; // Filter the props removing the empty ones
        Object.entries(props).forEach(([key, value]) => {
            if(value !== '' && value !== undefined) {
                validProps[key] = value
            }
        });
        if(Object.keys(validProps).length > 0) {
            axios.patch(`${VITE_API_URL}/games/${slug}`, validProps, axiosHeaders(token))
                .then(obj => {
                    if(slug !== obj.data.slug){navigate(`/games/${obj.data.slug}`)}; // If the title is patched the slug will change, so we need to navigate to the new link
                    tempFeedback('Game updated successfully');
                    setGame(obj.data)
                })
                .catch(e => {
                    setFbError('Edit Game failed: Insert valid data.');
                    console.error(e)
                })
        }
    };

    return(<>
        <div className="page resource-page">
            {error && !game &&
                <NotFound/>
            }

            {!error && !game &&
                <p className="message center">Loading...</p>
            }

            {game && <>
                <h1 className="main-color center">{game.title}</h1>

                <section className="center">
                    <p className={feedback ? 'sec-color' : 'error'}>{fbError || feedback}</p>
                </section>
            
                <div className="resource-wrapper">

                    <section className="resource-props">
                        <figure className="game-cover center">
                            <img src={game.cover} alt={`${game.title} - Cover`} />
                        </figure>
                        <p className="center">
                            <span className="main-color">Publisher: </span>
                            <Link
                                to={`/publishers/${game.publisher?.slug}`}
                                className={'link'}
                                >
                                {` ${game.publisher.name}`}
                            </Link>
                        </p>
                        <p className="center"><span className="main-color">Genre: </span>{` ${game.genre.name}`}</p>
                        <p className="center"><span className="main-color">Released: </span>{` ${dayjs(game.createdAt).format('DD-MM-YYYY')}`}</p>
                        <p className="center"><span className="main-color">Description: </span>{` ${game.description}`}</p>
                    </section>

                    {user.type === 'developer' &&
                    <section className="edit-resource">
                        
                        <h3 className="center sec-color">Edit Game</h3>
                        
                        <div className="form">

                            {/*  INSERT TITLE  */}
                            <section className="form-field">
                                <p className="main-color">Title</p>
                                <input 
                                    type="text" 
                                    value={formData.title}
                                    onChange={e => setFormData({
                                        ...formData,
                                        title: e.target.value
                                    })}
                                />
                            </section>

                            {/*  SELECT PUBLISHER  */}
                            <section className="form-field">
                                <p className="main-color">Publisher</p>
                                <select
                                    value={formData.publisher}
                                    onChange={e => setFormData({
                                        ...formData,
                                        publisher: e.target.value
                                    })}
                                >
                                    <option value="">Select Publisher</option>
                                    {publishers?.map(pub => {
                                        return(
                                            <option 
                                                key={pub._id}
                                                value={pub._id}
                                            >{pub.name}
                                            </option>
                                        )
                                    })}
                                </select>
                            </section>

                            {/*  SELECT GENRE  */}
                            <section className="form-field">
                                <p className="main-color">Genre</p>
                                <select
                                    value={formData.genre}
                                    onChange={e => setFormData({
                                        ...formData,
                                        genre: e.target.value
                                    })}
                                >
                                    <option value="">Select Genre</option>
                                    {genres?.map(gen => {
                                        return(
                                            <option 
                                                key={gen._id}
                                                value={gen._id}
                                            >{gen.name}
                                            </option>
                                        )
                                    })}
                                </select>
                            </section>

                            {/*  INSERT COVER  */}
                            <section className="form-field">
                                <p className="main-color">Cover</p>
                                <input 
                                    type="text" 
                                    value={formData.cover}
                                    onChange={e => setFormData({
                                        ...formData,
                                        cover: e.target.value
                                    })}
                                />
                            </section>

                            {/*  INSERT DESCRIPTION  */}
                            <section className="form-field">
                                <p className="main-color">Description</p>
                                <textarea
                                    placeholder="Write a game description."
                                    maxLength={9999} 
                                    value={formData.description}
                                    onChange={e => setFormData({
                                        ...formData,
                                        description: e.target.value
                                    })}
                                />
                            </section>

                            {/*  SUBMIT BUTTON  */}
                            <section className="form-field">
                                <button
                                    onClick={() => {
                                        editGame(formData);
                                        setFormData(blankFormData);
                                        setRefresh(!refresh)
                                    }}
                                >Edit</button>
                            </section>

                        </div>

                    </section>
                    }

                </div>
            </>}
        </div>
    </>)
}