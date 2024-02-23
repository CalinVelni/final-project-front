import axios from "axios"
import { axiosHeaders } from "../../library/utilities"
import { useUser } from "../../context/UserContext"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
const { VITE_API_URL } = import.meta.env

export default function () {

    const { user, token } = useUser();
    
    // COLLECTIONS (Genres and Publishers needed for the select options)
    const [games, setGames] = useState();
    const [genres, setGenres] = useState();
    const [publishers, setPublishers] = useState();

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

    // SETTING COLLECTIONS
    useEffect(() => {
        axios.get(`${VITE_API_URL}/games`, axiosHeaders(token))
            .then(obj => setGames(obj.data))
            .catch(e => {
                setError('Error: Server connection failed.');
                console.error(e)
            })
    }, []);

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

    const addGame = (body) => {
        if(body.cover.trim().length < 1){delete body.cover} // The Game Schema gives a default value for cover and description, so I'm removing empty strings from the body to allow it
        if(body.description.trim().length < 1){delete body.description}

        axios.post(`${VITE_API_URL}/games`, body, axiosHeaders(token))
            .then((obj) => {
                setFbError(null);
                setGames(obj.data);
                tempFeedback('Game added successfully.')
            })
            .catch(e => {
                setFbError('Add new Game failed: Insert valid data.');
                console.error(e)
            })
    };

    const deleteGame = (slug) => {
        axios.delete(`${VITE_API_URL}/games/${slug}`, axiosHeaders(token))
            .then(obj => {
                setFbError(null);
                setGames(obj.data);
                tempFeedback('Game deleted successfully.')
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

            {!error && !games &&
                <p className="message center">Loading...</p>
            }

            {games?.length > 0 && <>
                <h1 className="main-color center">Games List</h1>

                <section className="center">
                    <p className={feedback ? 'sec-color' : 'error'}>{fbError || feedback}</p>
                </section>

                <div className="collection-wrapper">

                {games?.length < 1 && <p className="sec-color center">No games available, add one.</p>}

                <ul className="collection-list center">
                    {games.map(g => {
                        return (
                            <li key={`${g._id}`}>
                                <Link
                                    to={`/games/${g.slug}`}
                                    className={'link'}
                                    >
                                    {`${g.title} `}<span className="main-color">|</span>{` ${g.publisher.name}`}
                                </Link>
                                <button
                                    onClick={() => deleteGame(g.slug)}
                                >Delete</button>
                            </li>
                        )
                    })}
                </ul>

                <section className="add-resource">
                        <h3 className="center sec-color">Add new Game</h3>

                        {/*  ADD NEW GAME FORM  */}
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
                                        addGame(formData);
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