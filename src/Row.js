import React, { useState, useEffect } from 'react'
import axios from './axios'
import './Row.css'
import Youtube from 'react-youtube'
import movieTrailer from 'movie-trailer'

const base_url = "https://image.tmdb.org/t/p/original/";
function Row({ title, fetchUrl, isLargePoster}) {
    const [movies, setMovies] = useState([]);
    const [trailerUrl, setTrailerUrl] = useState("");

    /*Snippet code to run based on specific condition */
    //if [], run once the load and dont run again
    useEffect(() => {
        async function fetchData(){
            const req = await axios.get(fetchUrl);
            console.log(req.data.results);
            setMovies(req.data.results);
            return req;
        }
        fetchData();
    }, [fetchUrl]);
    console.table(movies);

    const handleMovieClick = (movie) =>{    
        if(trailerUrl){
            setTrailerUrl('');
        }else{
            movieTrailer(movie?.name || "")
            .then(url=>{
                const urlParams =new URLSearchParams(new URL(url).search);
                setTrailerUrl(urlParams.get('v'))
            }).catch(error => console.log(error))
        }
    };

    const options = {
        height: "300",
        width: "100%",
        playerVars: {
            autoplay:1
        },
    };

    return (
        <div className="row">
             <h2>{title}</h2>
                <div className="row__posters">
                  {movies.map(movie => (
                      <img key={movie.id}
                       onClick={() => handleMovieClick(movie)}
                       className={`row__poster ${isLargePoster && "row__posterLarge"}`} 
                          src={`${base_url}${isLargePoster ? movie.poster_path : movie.backdrop_path}`}
                           alt={movie.name}/>
                  ))}
              </div>
              {trailerUrl && <Youtube videoId={trailerUrl} opts={options}/>}
        </div>
    )
}

export default Row
